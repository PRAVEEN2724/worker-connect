import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to a Supabase Storage bucket
 * @param {File} file - The file to upload
 * @param {string} bucket - Bucket name ('profiles' or 'work-samples')
 * @param {string} folder - Subfolder (e.g. userId)
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadFile(file, bucket, folder) {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
