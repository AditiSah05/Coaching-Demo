import { currentUser, ensureOwner, publicUser } from '../../../../server/auth';
import { json } from '../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  await ensureOwner();
  const user = await currentUser(request);
  return user ? json({ user: publicUser(user) }) : json({ user: null }, 401);
}
