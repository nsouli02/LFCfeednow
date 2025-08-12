import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
  res.cookies.set('session', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}


