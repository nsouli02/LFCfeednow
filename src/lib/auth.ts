import bcrypt from 'bcryptjs';
import { getSupabase } from './supabaseClient';

type AdminRow = { id: number; password_hash: string | null };

export async function isPasswordValidAgainstSupabase(code: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  // Fetch first admin row (single admin scenario)
  const { data, error } = await supabase
    .from('admins')
    .select('id, password_hash')
    .limit(1)
    .maybeSingle<AdminRow>();
  if (error || !data?.password_hash) return false;
  try {
    return bcrypt.compareSync(code, data.password_hash);
  } catch {
    return false;
  }
}


