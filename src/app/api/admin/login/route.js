import { ensureOwner, verifyPassword, sessionCookie, publicUser, sameOrigin, limited, clientIp } from '../../../../server/auth';
import { read, mutate } from '../../../../server/store';
import { json, readJson } from '../../../../server/http';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Blocked.' }, 403);
  await ensureOwner();
  const ip = clientIp(request);
  if (limited(`login:${ip}`, 8, 15 * 60 * 1000)) return json({ error: 'Too many attempts. Please wait 15 minutes.' }, 429);
  const body = await readJson(request, 2000);
  const email = String(body?.email || '').trim().toLowerCase();
  const user = (await read(['users'])).users.find((u) => u.email === email);
  // Same answer for "no such user" and "wrong password", and the same work, so neither can be told apart.
  const ok = user && user.active && (await verifyPassword(String(body?.password || ''), user.passwordHash));
  if (!ok) return json({ error: 'Incorrect email or password.' }, 401);
  await mutate((db) => { db.users.find((u) => u.id === user.id).lastLoginAt = new Date().toISOString(); });
  return json({ user: publicUser(user) }, 200, { 'Set-Cookie': await sessionCookie(user.id) });
}
