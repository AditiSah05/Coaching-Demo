// Admin gate: a signed cookie that only a browser which opened the secret entry address receives.
export const GATE_COOKIE = 'pma_gate';
export const GATE_HEADER = 'x-admin-gate';
export const GATE_MAX_AGE = 60 * 60 * 24 * 30;

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function gateValue(entry) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(`${process.env.SESSION_SECRET || ''}:${entry}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('pma-admin-gate')));
}
