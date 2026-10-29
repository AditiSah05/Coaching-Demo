import { NextResponse } from 'next/server';

// The admin code sends people here when they need to sign in (signed out, or after logging out). This sends them to the
// sign-in page, which lives at the secret entry address. A browser without the gate cookie is stopped before it gets here.
export async function GET(request) {
  const entry = process.env.ADMIN_ENTRY;
  return NextResponse.redirect(new URL(entry ? `/${entry}` : '/admin/login', request.url));
}
