import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isPasswordValidAgainstSupabase } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const form = await request.formData();
  const stripWrapQuotes = (s: string) => s.replace(/^['"]|['"]$/g, '');
  const decodeURIComponentSafe = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
  const normalize = (s: string) => (s?.normalize ? s.normalize('NFKC') : s);
  const raw = ((form.get('code') as string) || '').trim();
  const code = stripWrapQuotes(raw);
  const codeDecoded = stripWrapQuotes(decodeURIComponentSafe(raw));
  const codeNorm = stripWrapQuotes(normalize(raw));
  const candidates = Array.from(new Set([code, codeDecoded, codeNorm]));

  // Prefer Supabase admin user check; fall back to env hash if not configured
  let ok = await isPasswordValidAgainstSupabase(code);
  if (!ok) {
    const envHashRaw = (process.env.ADMIN_HASH_CODE_B64
      ? Buffer.from((process.env.ADMIN_HASH_CODE_B64 as string).trim(), 'base64').toString('utf8')
      : (process.env.ADMIN_HASH_CODE || '')).trim();
    const storedHash = stripWrapQuotes(envHashRaw);
    if (storedHash && storedHash.startsWith('$2')) {
      const directEq = candidates.some((c) => c === storedHash);
      let bcryptOk = false;
      try { bcryptOk = candidates.some((c) => bcrypt.compareSync(c, storedHash)); } catch {}
      ok = directEq || bcryptOk;
    }
  }
  if (!ok) return NextResponse.redirect(new URL('/admin?error=1', request.url), { status: 303 });

  const secret = stripWrapQuotes((process.env.ADMIN_SESSION_SECRET || '').trim());
  if (!secret) return NextResponse.redirect(new URL('/admin?error=1', request.url), { status: 303 });
  const res = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
  res.cookies.set('session', secret, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}


