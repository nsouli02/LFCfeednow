import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const envTable = (process.env.NEXT_PUBLIC_SUPABASE_POSTS_TABLE || 'manual_posts').trim();
  const table = envTable;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ table, error: 'supabase not configured' }, { status: 500 });
  try {
    const { data, error } = await supabase.from(table).select('id').limit(20);
    if (error) return NextResponse.json({ table, error: error.message }, { status: 500 });
    return NextResponse.json({ table, ids: (data || []).map((r: any) => r.id) });
  } catch (e: any) {
    return NextResponse.json({ table, error: String(e?.message || e) }, { status: 500 });
  }
}


