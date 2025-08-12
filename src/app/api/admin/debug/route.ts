import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'disabled' }, { status: 404 });
  }
  const url = new URL(request.url);
  const raw = (url.searchParams.get('code') || '').trim();
  const strip = (s: string) => s.replace(/^['"]|['"]$/g, '');
  const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
  const norm = (s: string) => (s?.normalize ? s.normalize('NFKC') : s);
  const variants = Array.from(new Set([strip(raw), strip(dec(raw)), strip(norm(raw))]));
  const hash = strip((process.env.ADMIN_HASH_CODE_B64 ? Buffer.from((process.env.ADMIN_HASH_CODE_B64 as string).trim(), 'base64').toString('utf8') : (process.env.ADMIN_HASH_CODE || '')).trim());
  const directEq = variants.some((v) => v === hash);
  const bcryptOk = hash.startsWith('$2') && variants.some((v) => { try { return bcrypt.compareSync(v, hash); } catch { return false; } });
  return NextResponse.json({ ok: directEq || bcryptOk, directEq, bcryptOk, variants, hashPrefix: hash.slice(0, 12) });
}


