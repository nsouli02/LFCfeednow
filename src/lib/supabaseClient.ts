import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
export const supabaseConfigured: boolean = Boolean(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim() &&
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
);

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (cachedClient) return cachedClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}


