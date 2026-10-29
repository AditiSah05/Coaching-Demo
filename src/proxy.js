import { NextResponse } from 'next/server';
import { GATE_COOKIE, GATE_HEADER, gateValue } from './lib/gate';

// Admin gate. When ADMIN_ENTRY is set:
//  - /admin/login never answers (404 for everyone). The sign-in page lives only at the secret entry address
//    (see next.config.mjs), for example /my-secret-word.
//  - The rest of the admin and the admin API need the gate cookie. The sign-in page carries a token that lets the
//    login request through; a successful login then sets the cookie (see the login route).
// Anyone else gets the normal "page not found" answer, so the admin cannot be found or tried.
// When ADMIN_ENTRY is not set (local work), the gate is off. The password login still applies on top.
export async function proxy(request) {
  const entry = process.env.ADMIN_ENTRY;
  if (!entry) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const notFound = () => NextResponse.rewrite(new URL('/page-not-found', request.url));
  if (pathname === '/admin/login') return notFound();

  const want = await gateValue(entry);
  if (pathname === '/api/admin/login' && request.headers.get(GATE_HEADER) === want) return NextResponse.next();
  if (request.cookies.get(GATE_COOKIE)?.value === want) return NextResponse.next();
  return notFound();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
