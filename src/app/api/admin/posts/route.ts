import { NextResponse } from 'next/server';
import type { FeedItem } from '@/lib/types';
import { addManualPost, listManualPosts, updateManualPost } from '@/lib/adminStore';

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
  const fullText = (form.get('fullText') as string) || `${title} — ${description}`;
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
    await updateManualPost(id, { title, description, fullText });
  } else {
    await addManualPost(item);
  }
  return NextResponse.redirect(new URL('/admin', request.url));
}

export async function GET() {
  const items = await listManualPosts();
  return NextResponse.json({ items });
}


