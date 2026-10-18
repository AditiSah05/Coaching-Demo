import { guard } from '../../../../server/auth';
import { read } from '../../../../server/store';
import { json } from '../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const g = await guard(request, 'activity');
  if (g.response) return g.response;
  return json({ activity: (await read(['activity'])).activity.slice(0, 300) });
}
