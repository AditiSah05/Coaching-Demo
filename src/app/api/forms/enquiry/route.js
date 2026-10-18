import { submitPublic } from '../../../../server/crud';
import { sameOrigin, limited, clientIp } from '../../../../server/auth';
import { json, readJson, result } from '../../../../server/http';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Blocked.' }, 403);
  if (limited('enquiry:' + clientIp(request), 5, 10 * 60 * 1000)) return json({ error: 'Too many submissions. Please wait a few minutes and try again.' }, 429);
  const body = await readJson(request, 20_000);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  if (body.website) return json({ record: { id: 'ok', status: 'Received' } }); // hidden trap field: only bots fill it
  return result(await submitPublic('enquiries', body));
}
