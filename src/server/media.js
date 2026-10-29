import fs from 'node:fs';
import path from 'node:path';
import { mutate, newId, cfEnv, dataDir, pgUrl, pgSql } from './store';
import { slugify } from '../shared/schema';

export const MAX_BYTES = 8 * 1024 * 1024;

// Images are stored in R2 on Cloudflare (binding `UPLOADS`), in the Postgres `uploads` table when DATABASE_URL is set,
// or in DATA_DIR/uploads anywhere else.
const bucket = () => cfEnv()?.UPLOADS || null;
const dir = () => path.join(dataDir(), 'uploads');

// Checks the real file contents, not the name or the type the browser claimed.
const sniff = (b) => {
  const s = (from, to) => String.fromCharCode(...b.subarray(from, to));
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 12 && b[0] === 0x89 && s(1, 4) === 'PNG') return 'png';
  if (b.length > 12 && s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'webp';
  if (b.length > 6 && s(0, 4) === 'GIF8') return 'gif';
  return null;
};
const TYPES = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif' };

// Saves one uploaded image and lists it in the media library. The admin page already shrinks the picture
// (max 1800px, WebP) in the browser; width and height are sent along with it.
export async function saveImage(file, user, dims = {}) {
  if (!file || typeof file.arrayBuffer !== 'function') return { error: 'No file received.' };
  if (file.size > MAX_BYTES) return { error: 'That image is larger than 8 MB.' };
  const buf = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) return { error: 'Only JPG, PNG, WebP or GIF images can be uploaded.' };

  const base = slugify(String(file.name || 'image').replace(/\.[^.]+$/, '')) || 'image';
  const name = `${Date.now().toString(36)}-${base}.${ext}`;
  const r = bucket();
  if (r) await r.put(name, buf, { httpMetadata: { contentType: TYPES[ext] } });
  else if (pgUrl()) { const sql = await pgSql(); await sql`INSERT INTO uploads (name, type, data) VALUES (${name}, ${TYPES[ext]}, ${Buffer.from(buf)})`; }
  else { fs.mkdirSync(dir(), { recursive: true }); fs.writeFileSync(path.join(dir(), name), buf); }

  const n = (v) => { const x = Math.round(Number(v)); return x > 0 && x < 20000 ? x : 0; };
  const item = { id: newId('med'), file: name, url: `/uploads/${name}`, name: String(file.name || name).slice(0, 120), width: n(dims.width), height: n(dims.height), size: buf.length, createdAt: new Date().toISOString(), uploadedBy: user?.name || '' };
  await mutate((db) => { db.media.unshift(item); });
  return { item };
}

export async function removeFile(file) {
  const name = path.basename(file);
  const r = bucket();
  if (r) { await r.delete(name); return; }
  if (pgUrl()) { const sql = await pgSql(); await sql`DELETE FROM uploads WHERE name = ${name}`; return; }
  const p = path.join(dir(), name);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

// Returns { body, type } or null.
export async function readUpload(file) {
  const name = path.basename(file);
  const type = TYPES[name.split('.').pop().toLowerCase()] || 'application/octet-stream';
  const r = bucket();
  if (r) { const o = await r.get(name); return o ? { body: o.body, type } : null; }
  if (pgUrl()) { const sql = await pgSql(); const [row] = await sql`SELECT data FROM uploads WHERE name = ${name}`; return row ? { body: row.data, type } : null; }
  const p = path.join(dir(), name);
  return fs.existsSync(p) ? { body: fs.readFileSync(p), type } : null;
}
