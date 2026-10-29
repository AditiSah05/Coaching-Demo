import { NextResponse } from 'next/server';
import { GATE_COOKIE, GATE_MAX_AGE, gateValue } from '../../../lib/gate';

// Reached only through the secret entry address (next.config.mjs rewrites it here). Gives the browser the gate cookie,
// then sends it to the login page. A direct request to /admin/enter is stopped by the gate in proxy.js.
export async function GET(request) {
  const entry = process.env.ADMIN_ENTRY;
  if (!entry) return NextResponse.redirect(new URL('/admin/login', request.url));
  const res = NextResponse.redirect(new URL('/admin/login', request.url));
  res.cookies.set(GATE_COOKIE, await gateValue(entry), { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: GATE_MAX_AGE });
  return res;
}
