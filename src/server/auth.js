import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { read, mutate, newId, DATA_DIR } from './store';
import { can } from '../shared/schema';

export const COOKIE = 'pma_admin';
const SESSION_HOURS = 12;

// ---- passwords (scrypt) ----
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
};
export const verifyPassword = (password, stored) => {
  const [alg, saltHex, hashHex] = String(stored || '').split('$');
  if (alg !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(expected, actual);
};

export const passwordProblem = (pw) => {
  if (typeof pw !== 'string' || pw.length < 8) return 'Use at least 8 characters.';
  if (pw.length > 100) return 'That password is too long.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Use letters and numbers.';
  return '';
};

// ---- signed session cookie ----
let secretCache;
const secret = () => {
  if (secretCache) return secretCache;
  if (process.env.SESSION_SECRET) return (secretCache = process.env.SESSION_SECRET);
  const file = path.join(DATA_DIR, '.session-secret');
  if (!fs.existsSync(file)) { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(file, crypto.randomBytes(32).toString('hex'), { mode: 0o600 }); }
  return (secretCache = fs.readFileSync(file, 'utf8').trim());
};
const b64 = (b) => Buffer.from(b).toString('base64url');
const sign = (payload) => {
  const body = b64(JSON.stringify(payload));
  return `${body}.${crypto.createHmac('sha256', secret()).update(body).digest('base64url')}`;
};
const unsign = (token) => {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const good = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig); const b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch { return null; }
};

export const sessionCookie = (userId) => {
  const token = sign({ uid: userId, exp: Date.now() + SESSION_HOURS * 3600 * 1000 });
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}${secure}`;
};
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

// ---- users ----
export const publicUser = (u) => u && { id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, mustChangePassword: !!u.mustChangePassword, lastLoginAt: u.lastLoginAt || null, createdAt: u.createdAt };

// First start: make the owner account. Set ADMIN_EMAIL and ADMIN_PASSWORD to choose it; otherwise the
// old demo login is used and the admin is forced to change the password on first sign-in.
export async function ensureOwner() {
  if (read().users.length) return;
  await mutate((db) => {
    if (db.users.length) return;
    const fromEnv = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD;
    db.users.push({
      id: newId('usr'), name: 'Administrator', role: 'superadmin', active: true,
      email: (fromEnv ? process.env.ADMIN_EMAIL : 'admin@pacificmarine.demo').toLowerCase(),
      passwordHash: hashPassword(fromEnv ? process.env.ADMIN_PASSWORD : 'Admin@123'),
      mustChangePassword: !fromEnv, createdAt: new Date().toISOString(),
    });
  });
}

// ---- who is calling ----
export const currentUser = (request) => {
  const p = unsign(request.cookies.get(COOKIE)?.value);
  if (!p) return null;
  const u = read().users.find((x) => x.id === p.uid);
  return u && u.active ? u : null;
};

// Origin check for writes: the page that sent the request must be this site.
export const sameOrigin = (request) => {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients (curl) send none; they still need the cookie
  const host = request.headers.get('host');
  try { return new URL(origin).host === host; } catch { return false; }
};

export const json = (data, status = 200, headers) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

// Use at the top of every admin route. Returns { user } or { response }.
export async function guard(request, area) {
  await ensureOwner();
  if (request.method !== 'GET' && !sameOrigin(request)) return { response: json({ error: 'Blocked: request came from another site.' }, 403) };
  const user = currentUser(request);
  if (!user) return { response: json({ error: 'Please sign in.' }, 401) };
  if (area && !can(user.role, area)) return { response: json({ error: 'Your role cannot do this.' }, 403) };
  return { user };
}

// ---- simple in-memory rate limiter (per key) ----
const hits = (globalThis.__pmaHits ??= new Map());
export function limited(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now); hits.set(key, arr);
  return false;
}
export const clientIp = (request) => (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';

export const logActivity = (db, user, action, target) => {
  db.activity.unshift({ id: newId('act'), at: new Date().toISOString(), user: user?.name || 'System', role: user?.role || '', action, target: target || '' });
  if (db.activity.length > 1000) db.activity.length = 1000;
};
