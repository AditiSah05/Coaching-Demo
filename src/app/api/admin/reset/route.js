import { guard, logActivity } from '../../../../server/auth';
import { mutate } from '../../../../server/store';
import { buildSeed } from '../../../../server/seed';
import { json, readJson } from '../../../../server/http';

const RESETTABLE = ['settings', 'banners', 'courses', 'blogs', 'gallery', 'videos', 'studyMaterials', 'forms', 'resultPosters', 'faculty', 'faqs'];

export async function POST(request) {
  const g = await guard(request, 'backup');
  if (g.response) return g.response;
  const b = await readJson(request, 1000);
  if (!RESETTABLE.includes(b?.collection)) return json({ error: 'That section cannot be reset.' }, 422);
  await mutate((db) => {
    db[b.collection] = buildSeed()[b.collection];
    logActivity(db, g.user, 'Reset to defaults', b.collection);
  });
  return json({ ok: true });
}
