import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

type AdminRow = { id: number; password_hash: string | null };

export async function isPasswordValidAgainstSupabase(code: string): Promise<boolean> {
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


