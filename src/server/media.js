import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { mutate, newId, DATA_DIR } from './store';
import { slugify } from '../shared/schema';

const UPLOADS = path.join(DATA_DIR, 'uploads');
export const MAX_BYTES = 8 * 1024 * 1024;

// Checks the real file contents, not the name or the type the browser claimed.
const sniff = (b) => {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (b.length > 6 && b.subarray(0, 4).toString() === 'GIF8') return 'gif';
  return null;
};

// Saves one uploaded image: checks it, shrinks it to at most 1800px, stores it as WebP and lists it in the media library.
export async function saveImage(file, user) {
  if (!file || typeof file.arrayBuffer !== 'function') return { error: 'No file received.' };
  if (file.size > MAX_BYTES) return { error: 'That image is larger than 8 MB.' };
  const buf = Buffer.from(await file.arrayBuffer());
  if (!sniff(buf)) return { error: 'Only JPG, PNG, WebP or GIF images can be uploaded.' };

  let out;
  try {
    out = await sharp(buf).rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  } catch {
    return { error: 'That file could not be read as an image.' };
  }
  const base = slugify(String(file.name || 'image').replace(/\.[^.]+$/, '')) || 'image';
  const name = `${Date.now().toString(36)}-${base}.webp`;
  fs.mkdirSync(UPLOADS, { recursive: true });
  fs.writeFileSync(path.join(UPLOADS, name), out.data);

  const item = { id: newId('med'), file: name, url: `/uploads/${name}`, name: String(file.name || name).slice(0, 120), width: out.info.width, height: out.info.height, size: out.data.length, createdAt: new Date().toISOString(), uploadedBy: user?.name || '' };
  await mutate((db) => { db.media.unshift(item); });
  return { item };
}

export const removeFile = (file) => {
  const p = path.join(UPLOADS, path.basename(file));
  if (p.startsWith(UPLOADS) && fs.existsSync(p)) fs.unlinkSync(p);
};

export const readUpload = (file) => {
  const p = path.join(UPLOADS, path.basename(file));
  return p.startsWith(UPLOADS) && fs.existsSync(p) ? fs.readFileSync(p) : null;
};
