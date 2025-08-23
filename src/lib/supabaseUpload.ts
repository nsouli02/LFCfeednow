import { getSupabase } from './supabaseClient';

export async function uploadToSupabase(file: File, path?: string): Promise<{ url: string; path: string } | null> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  // Generate unique file name
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = path || `${timestamp}.${fileExt}`;
  const fullPath = `manual-posts/${fileName}`;

  try {
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('manual-posts-media')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('manual-posts-media')
      .getPublicUrl(fullPath);

    return {
      url: publicUrl,
      path: fullPath
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

export async function deleteFromSupabase(path: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.storage
      .from('manual-posts-media')
      .remove([path]);

    return !error;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}
