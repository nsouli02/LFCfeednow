import { NextResponse } from 'next/server';
import { removeManualPost } from '@/lib/adminStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthed(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return cookie.includes(`session=${secret}`);
}

export async function POST(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let id = '';
  try {
    const form = await request.formData();
    id = (form.get('id') as string) || '';
  } catch {}
  if (!id) {
    const { searchParams } = new URL(request.url);
    id = searchParams.get('id') || '';
  }
  if (id) await removeManualPost(id);
  return NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
}


