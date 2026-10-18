import { guard } from '../../../../../../server/auth';
import { COLLECTIONS } from '../../../../../../shared/schema';
import { getRecord, updateRecord, deleteRecord } from '../../../../../../server/crud';
import { json, readJson, result } from '../../../../../../server/http';

export const dynamic = 'force-dynamic';

async function setup(request, params) {
  const { collection, id } = await params;
  const def = COLLECTIONS[collection];
  if (!def) return { response: json({ error: 'Unknown section.' }, 404) };
  const g = await guard(request, def.area);
  return g.response ? g : { user: g.user, collection, id };
}

export async function GET(request, { params }) {
  const s = await setup(request, params);
  if (s.response) return s.response;
  const rec = await getRecord(s.collection, s.id);
  return rec ? json({ record: rec }) : json({ error: 'Not found.' }, 404);
}

export async function PUT(request, { params }) {
  const s = await setup(request, params);
  if (s.response) return s.response;
  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  return result(await updateRecord(s.collection, s.id, body, s.user));
}

export async function DELETE(request, { params }) {
  const s = await setup(request, params);
  if (s.response) return s.response;
  return result(await deleteRecord(s.collection, s.id, s.user));
}
