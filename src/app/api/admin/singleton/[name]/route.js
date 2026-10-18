import { guard } from '../../../../../server/auth';
import { SINGLETONS } from '../../../../../shared/schema';
import { read } from '../../../../../server/store';
import { saveSingleton } from '../../../../../server/crud';
import { json, readJson, result } from '../../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { name } = await params;
  const def = SINGLETONS[name];
  if (!def) return json({ error: 'Unknown section.' }, 404);
  const g = await guard(request, def.area);
  if (g.response) return g.response;
  return json({ record: (await read([name]))[name] });
}

export async function PUT(request, { params }) {
  const { name } = await params;
  const def = SINGLETONS[name];
  if (!def) return json({ error: 'Unknown section.' }, 404);
  const g = await guard(request, def.area);
  if (g.response) return g.response;
  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  return result(await saveSingleton(name, body, g.user));
}
