import { guard, verifyPassword, hashPassword, passwordProblem, logActivity } from '../../../../server/auth';
import { mutate } from '../../../../server/store';
import { json, readJson } from '../../../../server/http';

export async function POST(request) {
  const g = await guard(request);
  if (g.response) return g.response;
  const body = await readJson(request, 2000);
  if (!(await verifyPassword(String(body?.current || ''), g.user.passwordHash))) return json({ error: 'Your current password is not correct.' }, 422);
  const problem = passwordProblem(body?.next);
  if (problem) return json({ error: problem }, 422);
  if (body.next === body.current) return json({ error: 'Choose a different password.' }, 422);
  const passwordHash = await hashPassword(body.next);
  await mutate((db) => {
    const u = db.users.find((x) => x.id === g.user.id);
    u.passwordHash = passwordHash;
    u.mustChangePassword = false;
    logActivity(db, g.user, 'Changed own password', '');
  });
  return json({ ok: true });
}
