import type { FeedItem } from './types';
import { getSupabase } from './supabaseClient';

// Allow choosing table via env; defaults to 'manual_posts'.
// If you prefer using your existing table 'Adminpost', set NEXT_PUBLIC_SUPABASE_POSTS_TABLE=Adminpost
const TABLE = (process.env.NEXT_PUBLIC_SUPABASE_POSTS_TABLE || 'manual_posts').trim();
const IS_ADMINPOST = TABLE.toLowerCase() === 'adminpost';

export async function addManualPost(item: FeedItem): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  let insertPayload: Record<string, any>;
  if (IS_ADMINPOST) {
    // Adminpost columns: id (int8), created_at (timestamptz), title (text), content (text)
    const content = [item.description, item.fullText].filter(Boolean).join('\n\n');
    insertPayload = {
      title: item.title,
      content,
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
  const { error } = await supabase.from(TABLE).delete().eq('id', matchValue);
  return !error;
}

export async function listManualPosts(): Promise<FeedItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  if (IS_ADMINPOST) {
    const { data } = await supabase
      .from(TABLE)
      .select('id, created_at, title, content')
      .order('created_at', { ascending: false });
    return (
      data?.map((r: any) => ({
        id: String(r.id),
        platform: 'manual',
        title: r.title,
        description: r.content ?? '',
        fullText: r.content ?? '',
        mediaUrl: undefined,
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


