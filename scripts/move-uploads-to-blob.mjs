// Moves the images stored inside Postgres (the `uploads` table) to Vercel Blob and rewrites every `/uploads/<name>`
// address in the site content to the new Blob address. Run it once the database is reachable.
//
//   DATABASE_URL="postgres://..." BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." node scripts/move-uploads-to-blob.mjs
//
// Add --dry-run to only list what would happen. Add --delete-old to remove the copies from Postgres afterwards
// (do that only after checking the site shows the images). Safe to run twice: images already moved are skipped.
import postgres from 'postgres';
import { put } from '@vercel/blob';

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const deleteOld = args.includes('--delete-old');
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url || !process.env.BLOB_READ_WRITE_TOKEN) { console.error('Set DATABASE_URL and BLOB_READ_WRITE_TOKEN.'); process.exit(1); }

const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 20, onnotice: () => {} });
try {
  const images = await sql`SELECT name, type FROM uploads ORDER BY name`;
  console.log(`${images.length} image(s) in the database.`);
  const moved = new Map(); // "/uploads/x.webp" -> blob address
  for (const { name, type } of images) {
    if (dry) { console.log('would move', name); continue; }
    const [row] = await sql`SELECT data FROM uploads WHERE name = ${name}`;
    const blob = await put(`uploads/${name}`, row.data, { access: 'public', contentType: type, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31536000 });
    moved.set(`/uploads/${name}`, blob.url);
    console.log('moved', name, '->', blob.url);
  }
  if (dry || !moved.size) process.exit(0);

  // Rewrite the addresses. The lock row gets a new value so every running server drops its cached copy.
  await sql.begin(async (tx) => {
    const rows = await tx`SELECT key, value FROM store WHERE key <> '__v' FOR UPDATE`;
    let changed = 0;
    for (const r of rows) {
      let v = r.value;
      for (const [from, to] of moved) {
        v = v.split(from).join(to);
        // library entries keep the stored file name, which is what deleting uses: point it at the new address too
        v = v.split(`"file":"${from.slice('/uploads/'.length)}"`).join(`"file":"${to}"`);
      }
      if (v !== r.value) { await tx`UPDATE store SET value = ${v} WHERE key = ${r.key}`; changed++; console.log('updated', r.key); }
    }
    await tx`UPDATE store SET value = ${crypto.randomUUID()} WHERE key = '__v'`;
    console.log(`${changed} section(s) rewritten.`);
  });

  if (deleteOld) { await sql`DELETE FROM uploads WHERE name = ANY(${sql.array([...moved.keys()].map((k) => k.slice('/uploads/'.length)))})`; console.log('Old copies removed from Postgres.'); }
} finally { await sql.end(); }
