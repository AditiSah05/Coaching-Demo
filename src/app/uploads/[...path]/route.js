import { readUpload } from '../../../server/media';

const types = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif' };

export async function GET(request, { params }) {
  const { path } = await params;
  const file = path.join('/');
  const buf = readUpload(file);
  if (!buf) return new Response('Not found', { status: 404 });
  const ext = file.split('.').pop().toLowerCase();
  return new Response(buf, { headers: { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
