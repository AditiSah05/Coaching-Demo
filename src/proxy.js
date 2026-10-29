import { NextResponse } from 'next/server';
import { GATE_COOKIE, gateValue } from './lib/gate';

// Admin gate. When ADMIN_ENTRY is set, the admin pages and the admin API only exist for a browser that has first opened
// the secret entry address, for example /my-secret-word (see next.config.mjs). That visit sets a signed cookie.
// Everyone else gets the normal "page not found" answer, so the admin login cannot be found or tried.
// When ADMIN_ENTRY is not set (local work), the gate is off. The password login still applies on top.
export async function proxy(request) {
  const entry = process.env.ADMIN_ENTRY;
  if (!entry) return NextResponse.next();
  if (request.cookies.get(GATE_COOKIE)?.value === (await gateValue(entry))) return NextResponse.next();
  return NextResponse.rewrite(new URL('/page-not-found', request.url));
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
