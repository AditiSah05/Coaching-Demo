import { clearCookie } from '../../../../server/auth';
import { json } from '../../../../server/http';

export async function POST() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });
}
