import fs from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { buildSeed } from './seed';

// Two backends behind one API:
//  - Cloudflare: D1 (one row per top-level key, see `store` table). Used whenever a `DB` binding exists.
//  - Postgres (Vercel + Neon, or any Postgres): used when DATABASE_URL is set.
//  - Anywhere else (local dev, a VPS): a JSON file in DATA_DIR.
// Everything is async so both look the same to callers.

const SCHEMA_VERSION = 1;
const LOCK = '__v';

export const cfEnv = () => { try { return getCloudflareContext().env || null; } catch { return null; } };
const d1 = () => cfEnv()?.DB || null;

export const newId = (prefix) => {
  const r = crypto.getRandomValues(new Uint8Array(3));
  return `${prefix}-${Date.now().toString(36)}${[...r].map((b) => b.toString(16).padStart(2, '0')).join('')}`;
};
const token = () => [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, '0')).join('');

// Keys the public website needs. Reading only these keeps a page view to a few small D1 rows.
export const PUBLIC_KEYS = ['settings', 'banners', 'courses', 'blogs', 'gallery', 'videos', 'studyMaterials', 'forms', 'resultPosters', 'faculty', 'faqs', 'reviews'];

// Public pages are cached by Next.js and Vercel. After a save that changed something visitors can see, throw the cached
// pages away so the next visit rebuilds them with the new content. Saves that only touch enquiries, accounts, the
// activity log and so on leave the cache alone.
const PUBLIC_SET = new Set(PUBLIC_KEYS);
function revalidatePublic(changedKeys) {
  if (!changedKeys.some((k) => PUBLIC_SET.has(k))) return;
  try { revalidatePath('/', 'layout'); } catch { /* not inside a request (a script): nothing is cached */ }
}

// Fills in anything a newer version of the site added. Returns the keys that were missing.
const missingKeys = (db) => {
  const seed = buildSeed();
  const added = [];
  for (const k of Object.keys(seed)) if (db[k] === undefined) { db[k] = seed[k]; added.push(k); }
  return added;
};

// ================= shared read cache =================
// A page view used to download every section (about 200 KB) from the database. Now the whole database has one tiny
// "version" row (LOCK) that changes on every save. We keep the sections we have read, check that one row, and only
// download again when it has changed. On an error we serve the copy we have rather than failing the page.
const rc = (globalThis.__pmaRc ??= { lock: null, at: 0, raw: {}, all: false });
const LOCK_CHECK_MS = 3000; // other servers see a save within this long
export const dropCache = () => { rc.lock = null; rc.at = 0; rc.raw = {}; rc.all = false; };

async function cachedLoad(src, keys, { fresh = false } = {}) {
  const want = keys ? [...new Set(keys)] : null;
  const have = () => (want ? want.every((k) => k in rc.raw) : rc.all);
  const out = () => {
    const raw = {}; const data = {};
    for (const k of want || Object.keys(rc.raw)) if (rc.raw[k] != null) { raw[k] = rc.raw[k]; data[k] = JSON.parse(rc.raw[k]); }
    return { data, raw, lock: rc.lock };
  };
  try {
    if (fresh || !have() || Date.now() - rc.at >= LOCK_CHECK_MS) {
      let lock = await src.lock();
      if (lock == null) { await src.seed(); lock = await src.lock(); } // first start: write the starting content
      if (lock !== rc.lock) { rc.lock = lock; rc.raw = {}; rc.all = false; }
      rc.at = Date.now();
      if (!have()) {
        const missing = want ? want.filter((k) => !(k in rc.raw)) : null;
        for (const r of await src.rows(missing)) rc.raw[r.key] = r.value;
        if (missing) for (const k of missing) rc.raw[k] ??= null; else rc.all = true;
      }
    }
    return out();
  } catch (e) {
    if (!fresh && have()) { console.error('Database unreachable, serving the saved copy:', e?.message); return out(); }
    throw e;
  }
}

// ================= D1 =================
let d1Ready = false;
const d1Src = (db) => ({
  async lock() {
    if (!d1Ready) { await db.prepare('CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run(); d1Ready = true; }
    return (await db.prepare('SELECT value FROM store WHERE key = ?').bind(LOCK).first('value')) ?? null;
  },
  async rows(want) {
    const q = want ? db.prepare(`SELECT key, value FROM store WHERE key IN (${want.map(() => '?').join(',')})`).bind(...want) : db.prepare('SELECT key, value FROM store WHERE key <> ?').bind(LOCK);
    return (await q.all()).results;
  },
  async seed() {
    // INSERT OR IGNORE so two first requests cannot clash.
    const stmts = Object.entries(buildSeed()).map(([k, v]) => db.prepare('INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)').bind(k, JSON.stringify(v)));
    stmts.push(db.prepare('INSERT OR IGNORE INTO store (key, value) VALUES (?, ?)').bind(LOCK, token()));
    await db.batch(stmts);
  },
});

async function d1Mutate(db, fn) {
  const src = d1Src(db);
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, raw, lock } = await cachedLoad(src, null, { fresh: true });
    const added = missingKeys(data);
    const result = await fn(data);
    const changed = Object.keys(data).filter((k) => JSON.stringify(data[k]) !== raw[k] || added.includes(k));
    if (!changed.length) return result;

    // The first statement only succeeds if nobody else wrote since we read. The rest only run if it did.
    const next = token();
    const stmts = [db.prepare(`UPDATE store SET value = ? WHERE key = '${LOCK}' AND value = ?`).bind(next, lock)];
    for (const k of changed) {
      stmts.push(db.prepare(`INSERT INTO store (key, value) SELECT ?1, ?2 WHERE EXISTS (SELECT 1 FROM store WHERE key = '${LOCK}' AND value = ?3) ON CONFLICT(key) DO UPDATE SET value = ?2`).bind(k, JSON.stringify(data[k]), next));
    }
    const res = await db.batch(stmts);
    dropCache();
    if (res[0].meta.changes === 1) { revalidatePublic(changed); return result; }
    // Someone else saved first: read again and redo this change on top of theirs.
  }
  throw new Error('The site is busy. Please try again.');
}

// ================= Postgres (Vercel, Neon, any Postgres) =================
// Used when DATABASE_URL (or POSTGRES_URL) is set and there is no D1 binding. Same one-row-per-key layout as D1.
export const pgUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || null;

// One connection pool per server process, kept on globalThis so a module reload (dev mode) does not open a second set.
// The promise is stored, not the client, so two requests arriving together cannot each create one.
const pgState = (globalThis.__pmaPg ??= { ready: null });
export function pgSql() {
  pgState.ready ??= (async () => {
    const { default: postgres } = await import('postgres');
    // prepare: false keeps it working behind a connection pooler (Neon's pooled address).
    const sql = postgres(pgUrl(), { max: Number(process.env.PG_POOL_MAX) || 3, idle_timeout: 10, prepare: false, connect_timeout: 10, onnotice: () => {} });
    await sql`CREATE TABLE IF NOT EXISTS store (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS uploads (name TEXT PRIMARY KEY, type TEXT NOT NULL, data BYTEA NOT NULL)`;
    return sql;
  })().catch((e) => { pgState.ready = null; throw e; });
  return pgState.ready;
}

const pgSrc = {
  async lock() {
    const sql = await pgSql();
    const [r] = await sql`SELECT value FROM store WHERE key = ${LOCK}`;
    return r?.value ?? null;
  },
  async rows(want) {
    const sql = await pgSql();
    return want ? sql`SELECT key, value FROM store WHERE key = ANY(${sql.array(want)})` : sql`SELECT key, value FROM store WHERE key <> ${LOCK}`;
  },
  async seed() {
    // ON CONFLICT DO NOTHING so two first requests cannot clash.
    const sql = await pgSql();
    await sql.begin(async (tx) => {
      for (const [k, v] of Object.entries(buildSeed())) await tx`INSERT INTO store (key, value) VALUES (${k}, ${JSON.stringify(v)}) ON CONFLICT (key) DO NOTHING`;
      await tx`INSERT INTO store (key, value) VALUES (${LOCK}, ${token()}) ON CONFLICT (key) DO NOTHING`;
    });
  },
};

async function pgMutate(fn) {
  const sql = await pgSql();
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, raw, lock } = await cachedLoad(pgSrc, null, { fresh: true });
    const added = missingKeys(data);
    const result = await fn(data);
    const changed = Object.keys(data).filter((k) => JSON.stringify(data[k]) !== raw[k] || added.includes(k));
    if (!changed.length) return result;

    // The lock row only updates if nobody else wrote since we read. If it did not, nothing is written and we try again.
    const saved = await sql.begin(async (tx) => {
      const res = await tx`UPDATE store SET value = ${token()} WHERE key = ${LOCK} AND value = ${lock}`;
      if (res.count !== 1) return false;
      for (const k of changed) await tx`INSERT INTO store (key, value) VALUES (${k}, ${JSON.stringify(data[k])}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
      return true;
    });
    dropCache();
    if (saved) { revalidatePublic(changed); return result; }
  }
  throw new Error('The site is busy. Please try again.');
}

// ================= file =================
const g = globalThis;
g.__pma ??= { db: null, queue: Promise.resolve() };
const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), 'data');
const file = () => path.join(dataDir(), 'db.json');

function fileWrite(db) {
  fs.mkdirSync(path.join(dataDir(), 'uploads'), { recursive: true });
  const tmp = `${file()}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ ...db, version: SCHEMA_VERSION }));
  fs.renameSync(tmp, file());
}

function fileLoad() {
  if (g.__pma.db) return g.__pma.db;
  fs.mkdirSync(path.join(dataDir(), 'uploads'), { recursive: true });
  let db;
  if (fs.existsSync(file())) {
    db = JSON.parse(fs.readFileSync(file(), 'utf8'));
    if (missingKeys(db).length) fileWrite(db);
  } else {
    db = buildSeed();
    fileWrite(db);
  }
  g.__pma.db = db;
  return db;
}

// ================= public API =================
// Read-only view. Do not change what it returns; use `mutate` for writes.
export async function read(keys) {
  const db = d1();
  if (db) return (await cachedLoad(d1Src(db), keys)).data;
  if (pgUrl()) return (await cachedLoad(pgSrc, keys)).data;
  return fileLoad();
}

// All writes go through here. `fn` gets the database, changes it, and may return a value. On D1 it can run
// more than once if another save lands at the same moment, so it must only depend on what it is given.
export function mutate(fn) {
  const db = d1();
  if (db) return d1Mutate(db, fn);
  if (pgUrl()) return pgMutate(fn);
  const run = g.__pma.queue.then(async () => {
    const data = fileLoad();
    const before = Object.fromEntries(PUBLIC_KEYS.map((k) => [k, JSON.stringify(data[k])]));
    const result = await fn(data);
    fileWrite(data);
    revalidatePublic(PUBLIC_KEYS.filter((k) => JSON.stringify(data[k]) !== before[k]));
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

export { dataDir };
