import { guard } from '../../../../server/auth';
import { read, mutate } from '../../../../server/store';
import { json, readJson } from '../../../../server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const g = await guard(request);
  if (g.response) return g.response;
  const all = (await read(['notifications'])).notifications;
  return json({ unread: all.filter((n) => !n.read).length, notifications: all.slice(0, 100) });
}

// { action: 'read', id } or { action: 'readAll' } or { action: 'clear' }
export async function POST(request) {
  const g = await guard(request);
  if (g.response) return g.response;
  const body = await readJson(request, 1000);
  await mutate((db) => {
    if (body?.action === 'readAll') db.notifications.forEach((n) => { n.read = true; });
    else if (body?.action === 'read') { const n = db.notifications.find((x) => x.id === body.id); if (n) n.read = true; }
    else if (body?.action === 'clear') db.notifications = db.notifications.filter((n) => !n.read);
  });
  return json({ unread: (await read(['notifications'])).notifications.filter((n) => !n.read).length });
}
