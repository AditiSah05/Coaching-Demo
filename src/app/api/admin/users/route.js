import { guard, hashPassword, passwordProblem, publicUser, logActivity } from '../../../../server/auth';
import { read, mutate, newId } from '../../../../server/store';
import { ROLES } from '../../../../shared/schema';
import { json, readJson } from '../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const g = await guard(request, 'users');
  if (g.response) return g.response;
  return json({ users: (await read(['users'])).users.map(publicUser) });
}

export async function POST(request) {
  const g = await guard(request, 'users');
  if (g.response) return g.response;
  const b = await readJson(request, 3000);
  const name = String(b?.name || '').trim().slice(0, 80);
  const email = String(b?.email || '').trim().toLowerCase().slice(0, 120);
  if (!name) return json({ error: 'Enter a name.' }, 422);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'Enter a valid email.' }, 422);
  if (!ROLES[b?.role]) return json({ error: 'Choose a role.' }, 422);
  const problem = passwordProblem(b?.password);
  if (problem) return json({ error: problem }, 422);
  const passwordHash = await hashPassword(b.password);
  let err = '';
  let user;
  await mutate((db) => {
    if (db.users.some((u) => u.email === email)) { err = 'That email already has an account.'; return; }
    user = { id: newId('usr'), name, email, role: b.role, active: true, passwordHash, mustChangePassword: true, createdAt: new Date().toISOString() };
    db.users.push(user);
    logActivity(db, g.user, 'Added user', `${name} (${ROLES[b.role].label})`);
  });
  return err ? json({ error: err }, 422) : json({ user: publicUser(user) });
}
