import type { FeedItem } from './types';
import { getSupabase } from './supabaseClient';

// Match your current Supabase table structure
const TABLE = 'Adminpost';

export async function addManualPost(item: FeedItem): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  // Columns available: id (int8, identity), created_at (timestamptz), title (text), content (text)
  const content = [item.description, item.fullText].filter(Boolean).join('\n\n');
  const { error } = await supabase.from(TABLE).insert({
    title: item.title,
    content,
    created_at: item.timestamp,
  });
  if (error) throw new Error(`manual_posts insert failed: ${error.message}`);
}

export async function removeManualPost(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const numericId = Number(id);
  const { error } = await supabase.from(TABLE).delete().eq('id', isNaN(numericId) ? id : numericId);
  return !error;
}

export async function listManualPosts(): Promise<FeedItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
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
}


