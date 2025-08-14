import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { FeedItem } from '@/lib/types';
import { addManualPost, listManualPosts, updateManualPost, removeManualPost } from '@/lib/adminStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthed(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return cookie.includes(`session=${secret}`);
}

export async function POST(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const id = (form.get('id') as string) || '';
  const title = (form.get('title') as string) || '';
  const description = (form.get('description') as string) || '';
  const fullText = (form.get('fullText') as string) || description || '';
  const permalinkUrl = (form.get('permalinkUrl') as string) || '#';

  const item: FeedItem = {
    id: `manual_${Date.now()}`,
    platform: 'manual',
    title,
    description,
    fullText,
    mediaUrl: undefined,
    permalinkUrl,
    timestamp: new Date().toISOString(),
    sourceLabel: 'Manual',
  };
  if (id) {
    const ok = await updateManualPost(id, { title, description, fullText });
    if (!ok) {
      try { await removeManualPost(id); } catch {}
      await addManualPost(item);
    }
  } else {
    await addManualPost(item);
  }
  // Force pages to refresh cached data immediately after publish/edit
  try {
    revalidatePath('/');
    revalidatePath('/api/feeds');
    revalidatePath('/admin');
  } catch {}
  return NextResponse.redirect(new URL('/admin', request.url));
}

export async function GET() {
  const items = await listManualPosts();
  return NextResponse.json({ items });
}


