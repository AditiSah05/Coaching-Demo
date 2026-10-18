import { guard, logActivity } from '../../../../server/auth';
import { read, mutate } from '../../../../server/store';
import { json, readJson } from '../../../../server/http';

export const dynamic = 'force-dynamic';

const CONTENT = ['settings', 'banners', 'courses', 'blogs', 'gallery', 'videos', 'studyMaterials', 'forms', 'resultPosters', 'faculty', 'faqs', 'reviews', 'enquiries', 'admissions'];

// Download everything except accounts and passwords.
export async function GET(request) {
  const g = await guard(request, 'backup');
  if (g.response) return g.response;
  const db = read();
  const data = Object.fromEntries(CONTENT.map((k) => [k, db[k]]));
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 1), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="pma-backup-${new Date().toISOString().slice(0, 10)}.json"`, 'Cache-Control': 'no-store' },
  });
}

// Restore from a downloaded backup. Replaces the listed sections; accounts are never touched.
export async function POST(request) {
  const g = await guard(request, 'backup');
  if (g.response) return g.response;
  const body = await readJson(request, 40_000_000);
  const data = body?.data;
  if (!data || typeof data !== 'object') return json({ error: 'That is not a backup file.' }, 422);
  const keys = CONTENT.filter((k) => data[k] !== undefined);
  if (!keys.length) return json({ error: 'The file has no content to restore.' }, 422);
  for (const k of keys) {
    const isList = !['settings', 'banners'].includes(k);
    if (isList !== Array.isArray(data[k])) return json({ error: `The "${k}" section is not in the right shape.` }, 422);
  }
  await mutate((db) => {
    keys.forEach((k) => { db[k] = data[k]; });
    logActivity(db, g.user, 'Restored a backup', keys.join(', '));
  });
  return json({ restored: keys });
}
