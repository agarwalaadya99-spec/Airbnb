import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Ensure .env file is configured correctly.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export const uploadImage = async (bucket, path, file) => {
  try {
    console.log(`📤 Uploading to ${bucket}: ${path}...`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg'
      });

    if (error) {
      console.error('❌ Supabase storage error details:', {
        message: error.message,
        name: error.name,
        status: error.status,
        bucket,
        path
      });
      return null;
    }

    console.log('✅ Upload successful, getting public URL...');
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (err) {
    console.error('❌ Upload failed (exception):', err);
    return null; // Return null so caller can handle fallback
  }
};
