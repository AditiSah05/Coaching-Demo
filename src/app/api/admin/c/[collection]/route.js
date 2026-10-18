import { guard } from '../../../../../server/auth';
import { COLLECTIONS } from '../../../../../shared/schema';
import { listRecords, createRecord } from '../../../../../server/crud';
import { json, readJson, result } from '../../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { collection } = await params;
  const def = COLLECTIONS[collection];
  if (!def) return json({ error: 'Unknown section.' }, 404);
  const g = await guard(request, def.area);
  if (g.response) return g.response;
  return json({ records: listRecords(collection, { q: request.nextUrl.searchParams.get('q') || '' }) });
}

export async function POST(request, { params }) {
  const { collection } = await params;
  const def = COLLECTIONS[collection];
  if (!def) return json({ error: 'Unknown section.' }, 404);
  const g = await guard(request, def.area);
  if (g.response) return g.response;
  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  return result(await createRecord(collection, body, g.user));
}
