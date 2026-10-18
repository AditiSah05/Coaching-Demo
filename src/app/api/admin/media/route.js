import { guard } from '../../../../server/auth';
import { read } from '../../../../server/store';
import { json } from '../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const g = await guard(request, 'media');
  if (g.response) return g.response;
  return json({ media: (await read(['media'])).media });
}
