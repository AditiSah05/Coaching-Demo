import { readUpload } from '../../../server/media';

export async function GET(request, { params }) {
  const { path } = await params;
  const f = await readUpload(path.join('/'));
  if (!f) return new Response('Not found', { status: 404 });
  return new Response(f.body, { headers: { 'Content-Type': f.type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
