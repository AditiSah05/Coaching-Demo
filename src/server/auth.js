import { read, mutate, newId, cfEnv } from './store';
import { can } from '../shared/schema';

export const COOKIE = 'pma_admin';
const SESSION_HOURS = 12;

// Web Crypto only, so this runs the same on Node and on Cloudflare Workers.
const enc = new TextEncoder();
const toHex = (u8) => [...u8].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (h) => Uint8Array.from(h.match(/../g) || [], (x) => parseInt(x, 16));
const toB64 = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const same = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; };

// ---- passwords (PBKDF2-SHA256; 100,000 rounds is the most Workers allows) ----
const ROUNDS = 100000;
const derive = async (password, salt) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ROUNDS }, key, 256));
};
export const hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${toHex(salt)}$${toHex(await derive(password, salt))}`;
};
export const verifyPassword = async (password, stored) => {
  const [alg, saltHex, hashHex] = String(stored || '').split('$');
  if (alg !== 'pbkdf2' || !saltHex || !hashHex) return false;
  return same(fromHex(hashHex), await derive(password, fromHex(saltHex)));
};

export const passwordProblem = (pw) => {
  if (typeof pw !== 'string' || pw.length < 8) return 'Use at least 8 characters.';
  if (pw.length > 100) return 'That password is too long.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Use letters and numbers.';
  return '';
};

// ---- signed session cookie ----
// Secret: SESSION_SECRET if set, otherwise a random one made once and kept in the database.
let secretCache;
const secret = async () => {
  if (secretCache) return secretCache;
  const fromEnv = process.env.SESSION_SECRET || cfEnv()?.SESSION_SECRET;
  if (fromEnv) return (secretCache = fromEnv);
  let s = (await read(['secret'])).secret;
  if (!s) s = await mutate((db) => (db.secret ||= toHex(crypto.getRandomValues(new Uint8Array(32)))));
  return (secretCache = s);
};
const hmac = async (body) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(await secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
};
const sign = async (payload) => {
  const body = toB64(enc.encode(JSON.stringify(payload)));
  return `${body}.${toB64(await hmac(body))}`;
};
const unsign = async (token) => {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  try {
    if (!same(fromB64(sig), await hmac(body))) return null;
    const p = JSON.parse(new TextDecoder().decode(fromB64(body)));
    return p.exp > Date.now() ? p : null;
  } catch { return null; }
};

export const sessionCookie = async (userId) => {
  const token = await sign({ uid: userId, exp: Date.now() + SESSION_HOURS * 3600 * 1000 });
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}${secure}`;
};
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

// ---- users ----
export const publicUser = (u) => u && { id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, mustChangePassword: !!u.mustChangePassword, lastLoginAt: u.lastLoginAt || null, createdAt: u.createdAt };

// First start: make the owner account. Set ADMIN_EMAIL and ADMIN_PASSWORD to choose it; otherwise the
// old demo login is used and the admin is forced to change the password on first sign-in.
let ownerReady = false;
export async function ensureOwner() {
  if (ownerReady) return;
  if ((await read(['users'])).users?.length) return (ownerReady = true);
  const env = cfEnv() || {};
  const email = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
  const fromEnv = !!(email && password);
  const passwordHash = await hashPassword(fromEnv ? password : 'Admin@123');
  await mutate((db) => {
    if (db.users.length) return;
    db.users.push({
      id: newId('usr'), name: 'Administrator', role: 'superadmin', active: true,
      email: (fromEnv ? email : 'admin@pacificmarine.demo').toLowerCase(),
      passwordHash, mustChangePassword: !fromEnv, createdAt: new Date().toISOString(),
    });
  });
  ownerReady = true;
}

// ---- who is calling ----
export const currentUser = async (request) => {
  const p = await unsign(request.cookies.get(COOKIE)?.value);
  if (!p) return null;
  const u = (await read(['users'])).users.find((x) => x.id === p.uid);
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
  const user = await currentUser(request);
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
