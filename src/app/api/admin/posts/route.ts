import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { FeedItem } from '@/lib/types';
import { addManualPost, listManualPosts, updateManualPost, removeManualPost } from '@/lib/adminStore';
import { uploadToSupabase } from '@/lib/supabaseUpload';

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
  const mediaFile = form.get('media') as File | null;
  const deleteMedia = form.get('deleteMedia') === 'true';

  // Handle file upload or deletion
  let mediaUrl: string | null | undefined = undefined;
  let mediaType: 'image' | 'video' | null | undefined = undefined;
  
  if (deleteMedia) {
    // Delete current media
    mediaUrl = null;
    mediaType = null;
  } else if (mediaFile && mediaFile.size > 0) {
    // Upload new media
    try {
      const uploadResult = await uploadToSupabase(mediaFile);
      if (uploadResult) {
        mediaUrl = uploadResult.url;
        mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }
    } catch (error) {
      console.error('File upload failed:', error);
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
  }

  const item: FeedItem = {
    id: `manual_${Date.now()}`,
    platform: 'manual',
    title,
    description,
    fullText,
    mediaUrl: mediaUrl ?? undefined,
    mediaType: mediaType ?? undefined,
    permalinkUrl,
    timestamp: new Date().toISOString(),
    sourceLabel: 'Manual',
  };
  
  if (id) {
    // For edits, pass media changes including deletion
    const updateParams: any = { title, description, fullText };
    if (deleteMedia) {
      updateParams.mediaUrl = null;
      updateParams.mediaType = null;
    } else if (mediaFile && mediaFile.size > 0) {
      updateParams.mediaUrl = mediaUrl;
      updateParams.mediaType = mediaType;
    }
    
    const ok = await updateManualPost(id, updateParams);
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


