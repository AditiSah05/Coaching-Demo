import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildSeed } from './seed';

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'db.json');
const SCHEMA_VERSION = 1;

// Survives hot reloads in development.
const g = globalThis;
g.__pma ??= { db: null, queue: Promise.resolve() };

export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;

function ensureDir() { fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true }); }

function load() {
  if (g.__pma.db) return g.__pma.db;
  ensureDir();
  let db;
  if (fs.existsSync(FILE)) {
    db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    // Forward-fill anything a newer version of the site added.
    const seed = buildSeed();
    let changed = false;
    for (const k of Object.keys(seed)) if (db[k] === undefined) { db[k] = seed[k]; changed = true; }
    if (changed) write(db);
  } else {
    db = buildSeed();
    write(db);
  }
  g.__pma.db = db;
  return db;
}

// Write to a temp file and rename, so a crash never leaves a half-written database.
function write(db) {
  ensureDir();
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ ...db, version: SCHEMA_VERSION }));
  fs.renameSync(tmp, FILE);
}

// Read-only view. Do not change what it returns; use `mutate` for writes.
export const read = () => load();

// All writes go through one queue, so two admins saving at once cannot overwrite each other.
export function mutate(fn) {
  const run = g.__pma.queue.then(() => {
    const db = load();
    const result = fn(db);
    write(db);
    return result;
  });
  g.__pma.queue = run.catch(() => {});
  return run;
}

export const replaceAll = (next) => mutate((db) => {
  for (const k of Object.keys(db)) delete db[k];
  Object.assign(db, next);
});

export const resetCollection = (name) => mutate((db) => {
  const seed = buildSeed();
  if (seed[name] === undefined) throw new Error('Unknown collection');
  db[name] = seed[name];
});

export const sortRecords = (list, sort) => {
  if (!sort) return list;
  const dir = sort.desc ? -1 : 1;
  const cmp = (a, b, k, d) => {
    const x = a[k] ?? ''; const y = b[k] ?? '';
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * d;
    return String(x).localeCompare(String(y), 'en', { numeric: true }) * d;
  };
  return [...list].sort((a, b) => cmp(a, b, sort.key, dir) || (sort.then ? cmp(a, b, sort.then, 1) : 0));
};
