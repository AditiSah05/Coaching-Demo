import { guard } from '../../../../server/auth';
import { youtubeId } from '../../../../shared/schema';
import { json } from '../../../../server/http';

export const dynamic = 'force-dynamic';

// Looks up a video's title from YouTube so the admin does not have to type it.
export async function GET(request) {
  const g = await guard(request, 'videos');
  if (g.response) return g.response;
  const id = youtubeId(request.nextUrl.searchParams.get('url') || '');
  if (!id) return json({ error: 'That does not look like a YouTube link.' }, 422);
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return json({ id, title: '' });
    const d = await r.json();
    return json({ id, title: String(d.title || '').slice(0, 200) });
  } catch { return json({ id, title: '' }); }
}
