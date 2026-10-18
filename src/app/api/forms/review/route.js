import { submitReview } from '../../../../server/crud';
import { sameOrigin, limited, clientIp } from '../../../../server/auth';
import { json, readJson, result } from '../../../../server/http';

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Blocked.' }, 403);
  if (limited(`review:${clientIp(request)}`, 3, 60 * 60 * 1000)) return json({ error: 'You have sent a few reviews already. Please try again later.' }, 429);
  const body = await readJson(request, 10_000);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  if (body.website) return json({ ok: true }); // hidden trap field: only bots fill it
  return result(await submitReview(body));
}
