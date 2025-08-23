import type { FeedItem } from './types';
import { getSupabase } from './supabaseClient';
import { deleteFromSupabase } from './supabaseUpload';

// Allow choosing table via env; defaults to 'manual_posts'.
// If you prefer using your existing table 'Adminpost', set NEXT_PUBLIC_SUPABASE_POSTS_TABLE=Adminpost
const TABLE = (process.env.NEXT_PUBLIC_SUPABASE_POSTS_TABLE || 'manual_posts').trim();
const IS_ADMINPOST = TABLE.toLowerCase() === 'adminpost';

// Helper function to extract storage path from media URL
function extractStoragePath(mediaUrl: string): string | null {
  try {
    const url = new URL(mediaUrl);
    const pathMatch = url.pathname.match(/\/manual-posts-media\/(.+)$/);
    return pathMatch && pathMatch[1] ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

export async function addManualPost(item: FeedItem): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  let insertPayload: Record<string, any>;
  if (IS_ADMINPOST) {
    // Adminpost columns: id (int8), created_at (timestamptz), title (text), content (text), summary (text), media_url (text), media_type (text)
    insertPayload = {
      title: item.title,
      content: item.fullText || '',
      summary: item.description || null,
      media_url: item.mediaUrl || null,
      media_type: item.mediaType || null,
      created_at: item.timestamp,
    };
  } else {
    // manual_posts columns: id, title, description, full_text, media_url, permalink_url, timestamp, source_label
    insertPayload = {
      id: item.id,
      title: item.title,
      description: item.description,
      full_text: item.fullText,
      media_url: item.mediaUrl,
      permalink_url: item.permalinkUrl,
      timestamp: item.timestamp,
      source_label: item.sourceLabel,
    };
  }
  const { error } = await supabase.from(TABLE).insert(insertPayload);
  if (error) throw new Error(`manual_posts insert failed: ${error.message}`);
}

export async function removeManualPost(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  const numericId = Number(id);
  const matchValue = IS_ADMINPOST ? (isNaN(numericId) ? id : numericId) : id;
  
  try {
    // First, fetch the post to get the media_url for cleanup
    const { data: postData } = await supabase
      .from(TABLE)
      .select(IS_ADMINPOST ? 'media_url' : 'media_url')
      .eq('id', matchValue)
      .single();
    
    // If post has an associated image, delete it from storage
    if (postData?.media_url) {
      try {
        const storagePath = extractStoragePath(postData.media_url);
        if (storagePath) {
          await deleteFromSupabase(storagePath);
        }
      } catch (urlError) {
        console.warn('Failed to delete image from storage:', urlError);
        // Continue with post deletion even if image cleanup fails
      }
    }
    
    // Delete the database record
    const { error } = await supabase.from(TABLE).delete().eq('id', matchValue);
    return !error;
  } catch (error) {
    console.error('Error in removeManualPost:', error);
    return false;
  }
}

export async function listManualPosts(): Promise<FeedItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  if (IS_ADMINPOST) {
    const { data } = await supabase
      .from(TABLE)
      .select('id, created_at, title, content, summary, media_url, media_type')
      .order('created_at', { ascending: false });
    const excerpt = (text: string, max = 200) => {
      const t = (text || '').trim();
      if (t.length <= max) return t;
      return t.slice(0, max).replace(/\s+\S*$/, '') + '…';
    };
    return (
      data?.map((r: any) => ({
        id: String(r.id),
        platform: 'manual',
        title: r.title,
        description: (r.summary ?? '') || excerpt(r.content ?? ''),
        fullText: r.content ?? '',
        mediaUrl: r.media_url ?? undefined,
        mediaType: r.media_type ?? undefined,
        permalinkUrl: '#',
        timestamp: r.created_at ?? new Date().toISOString(),
        sourceLabel: 'Manual',
      })) ?? []
    );
  } else {
    const { data } = await supabase
      .from(TABLE)
      .select('*')
      .order('timestamp', { ascending: false });
    return (
      data?.map((r: any) => ({
        id: r.id,
        platform: 'manual',
        title: r.title,
        description: r.description,
        fullText: r.full_text || `${r.title} — ${r.description}`,
        mediaUrl: r.media_url ?? undefined,
        permalinkUrl: r.permalink_url || '#',
        timestamp: r.timestamp,
        sourceLabel: r.source_label || 'Manual',
      })) ?? []
    );
  }
}

export async function updateManualPost(
  id: string,
  params: { title?: string; content?: string; description?: string; fullText?: string; mediaUrl?: string | null; mediaType?: 'image' | 'video' | null }
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  const numericId = Number(id);
  const matchValue = IS_ADMINPOST ? (isNaN(numericId) ? id : numericId) : id;
  
  try {
    // If we're updating media, first fetch the current post to get the existing media_url
    let shouldCleanupOldMedia = false;
    let oldMediaUrl = '';
    
    if ('mediaUrl' in params) {
      const { data: currentPost } = await supabase
        .from(TABLE)
        .select(IS_ADMINPOST ? 'media_url' : 'media_url')
        .eq('id', matchValue)
        .single();
      
      if (currentPost?.media_url) {
        oldMediaUrl = currentPost.media_url;
        // Clean up old media if we're replacing it or setting it to null
        shouldCleanupOldMedia = params.mediaUrl !== currentPost.media_url;
      }
    }
    
    if (IS_ADMINPOST) {
      const combined = (params.fullText ?? params.content ?? '').trim();
      const updatePayload: Record<string, any> = {
        title: params.title ?? undefined,
        content: combined ?? undefined,
        summary: (params.description ?? null) as any,
        created_at: new Date().toISOString(),
      };
      
      // Handle media updates - include null values for deletion
      if ('mediaUrl' in params) {
        updatePayload.media_url = params.mediaUrl;
      }
      if ('mediaType' in params) {
        updatePayload.media_type = params.mediaType;
      }
      
      const { data, error } = await supabase
        .from(TABLE)
        .update(updatePayload)
        .eq('id', matchValue)
        .select('id');
      
      const success = !error && Array.isArray(data) && data.length > 0;
      
      // Clean up old media after successful update
      if (success && shouldCleanupOldMedia && oldMediaUrl) {
        try {
          const storagePath = extractStoragePath(oldMediaUrl);
          if (storagePath) {
            await deleteFromSupabase(storagePath);
          }
        } catch (cleanupError) {
          console.warn('Failed to cleanup old media during update:', cleanupError);
        }
      }
      
      return success;
    } else {
      const updatePayload: Record<string, any> = {
        title: params.title ?? undefined,
        description: params.description ?? undefined,
        full_text: params.fullText ?? params.content ?? undefined,
        timestamp: new Date().toISOString(),
      };
      
      // Handle media updates - include null values for deletion
      if ('mediaUrl' in params) {
        updatePayload.media_url = params.mediaUrl;
      }
      if ('mediaType' in params) {
        updatePayload.media_type = params.mediaType;
      }
      
      const { data, error } = await supabase
        .from(TABLE)
        .update(updatePayload)
        .eq('id', id)
        .select('id');
      
      const success = !error && Array.isArray(data) && data.length > 0;
      
      // Clean up old media after successful update
      if (success && shouldCleanupOldMedia && oldMediaUrl) {
        try {
          const storagePath = extractStoragePath(oldMediaUrl);
          if (storagePath) {
            await deleteFromSupabase(storagePath);
          }
        } catch (cleanupError) {
          console.warn('Failed to cleanup old media during update:', cleanupError);
        }
      }
      
      return success;
    }
  } catch (error) {
    console.error('Error in updateManualPost:', error);
    return false;
  }
}


