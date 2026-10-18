import { guard, hashPassword, passwordProblem, publicUser, logActivity } from '../../../../../server/auth';
import { mutate } from '../../../../../server/store';
import { ROLES } from '../../../../../shared/schema';
import { json, readJson } from '../../../../../server/http';

const lastOwner = (db, id) => db.users.filter((u) => u.role === 'superadmin' && u.active && u.id !== id).length === 0;

export async function PUT(request, { params }) {
  const g = await guard(request, 'users');
  if (g.response) return g.response;
  const { id } = await params;
  const b = await readJson(request, 3000);
  let err = ''; let user;
  await mutate((db) => {
    user = db.users.find((u) => u.id === id);
    if (!user) { err = 'Not found.'; return; }
    const nextRole = b?.role ?? user.role; const nextActive = b?.active ?? user.active;
    if (!ROLES[nextRole]) { err = 'Unknown role.'; return; }
    if ((user.role === 'superadmin' && (nextRole !== 'superadmin' || !nextActive)) && lastOwner(db, id)) { err = 'There must always be one active super admin.'; return; }
    if (id === g.user.id && !nextActive) { err = 'You cannot switch off your own account.'; return; }
    if (b?.name) user.name = String(b.name).trim().slice(0, 80);
    user.role = nextRole; user.active = !!nextActive;
    if (b?.password) {
      const p = passwordProblem(b.password);
      if (p) { err = p; return; }
      user.passwordHash = hashPassword(b.password); user.mustChangePassword = true;
    }
    logActivity(db, g.user, 'Edited user', user.name);
  });
  return err ? json({ error: err }, err === 'Not found.' ? 404 : 422) : json({ user: publicUser(user) });
}

export async function DELETE(request, { params }) {
  const g = await guard(request, 'users');
  if (g.response) return g.response;
  const { id } = await params;
  if (id === g.user.id) return json({ error: 'You cannot delete your own account.' }, 422);
  let err = '';
  await mutate((db) => {
    const i = db.users.findIndex((u) => u.id === id);
    if (i < 0) { err = 'Not found.'; return; }
    if (db.users[i].role === 'superadmin' && lastOwner(db, id)) { err = 'There must always be one active super admin.'; return; }
    const [gone] = db.users.splice(i, 1);
    logActivity(db, g.user, 'Deleted user', gone.name);
  });
  return err ? json({ error: err }, err === 'Not found.' ? 404 : 422) : json({ ok: true });
}
