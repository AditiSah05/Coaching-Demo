import { guard } from '../../../../server/auth';
import { saveImage } from '../../../../server/media';
import { json } from '../../../../server/http';

export async function POST(request) {
  const g = await guard(request, 'media');
  if (g.response) return g.response;
  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Invalid upload.' }, 400); }
  const r = await saveImage(form.get('file'), g.user);
  return r.error ? json({ error: r.error }, 422) : json({ media: r.item });
}
