import { json } from './auth';

export { json };

// Reads a small JSON body. Returns null when it is missing, too large or not valid JSON.
export async function readJson(request, maxBytes = 200_000) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > maxBytes) return null;
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const data = JSON.parse(text);
    return data && typeof data === 'object' ? data : null;
  } catch { return null; }
}

export const result = (r) => (r.error ? json({ error: r.error, fields: r.fields }, r.status || 400) : json(r));

// Runs a save for a public form. If the database cannot be reached, visitors get a clear message with another way
// to reach the academy, instead of "something went wrong, try again".
export async function saveOrApologise(fn) {
  try { return result(await fn()); } catch (e) {
    console.error('Form could not be saved:', e?.message);
    return json({ error: 'Sorry, we cannot save this right now. Please call or WhatsApp the academy on +91 8426074109 and we will help you straight away.' }, 503);
  }
}
