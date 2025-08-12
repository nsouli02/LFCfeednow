import type { FeedItem } from './types';
import { getSupabase, supabaseConfigured } from './supabaseClient';

const TABLE = 'manual_posts';

export async function addManualPost(item: FeedItem): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  await supabase.from(TABLE).insert({
    id: item.id,
    title: item.title,
    description: item.description,
    full_text: item.fullText,
    media_url: item.mediaUrl,
    permalink_url: item.permalinkUrl,
    timestamp: item.timestamp,
    source_label: item.sourceLabel,
  });
}

export async function removeManualPost(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return !error;
}

export async function listManualPosts(): Promise<FeedItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
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


