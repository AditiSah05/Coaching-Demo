// Copies the site's content from a Cloudflare D1 export into Postgres (Neon), for moving to Vercel.
//
//   1. npx wrangler d1 execute pacific-marine-academy-db --remote --json --command "SELECT key, value FROM store" > d1-dump.json
//   2. DATABASE_URL="postgres://..." node scripts/import-to-postgres.mjs d1-dump.json
//
// Add --skip=users,notifications,activity to leave those out.
// It refuses to run if the database already has content, unless you add --force (which replaces it).
import fs from 'node:fs';
import postgres from 'postgres';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const flag = args.includes('--force') ? '--force' : '';
// --skip=users,activity leaves those sections out (for example, to create a fresh admin account from ADMIN_EMAIL).
const skip = (args.find((a) => a.startsWith('--skip=')) || '').slice(7).split(',').filter(Boolean);
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!file || !url) { console.error('Usage: DATABASE_URL=... node scripts/import-to-postgres.mjs d1-dump.json [--force]'); process.exit(1); }

const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = ((Array.isArray(parsed) ? parsed[0] : parsed).results || []).filter((r) => !skip.includes(r.key));
if (!rows.length) { console.error('No rows found in the export.'); process.exit(1); }

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
try {
  await sql`CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS uploads (name TEXT PRIMARY KEY, type TEXT NOT NULL, data BYTEA NOT NULL)`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM store`;
  if (n > 0 && flag !== '--force') { console.error(`The database already has ${n} rows. Run again with --force to replace them.`); process.exit(1); }
  await sql.begin(async (tx) => {
    await tx`DELETE FROM store`;
    for (const r of rows) await tx`INSERT INTO store (key, value) VALUES (${r.key}, ${r.value})`;
    if (!rows.some((r) => r.key === '__v')) await tx`INSERT INTO store (key, value) VALUES ('__v', ${Math.random().toString(16).slice(2)})`;
  });
  console.log(`Imported ${rows.length} sections: ${rows.map((r) => r.key).filter((k) => k !== '__v').join(', ')}`);
} finally { await sql.end(); }
