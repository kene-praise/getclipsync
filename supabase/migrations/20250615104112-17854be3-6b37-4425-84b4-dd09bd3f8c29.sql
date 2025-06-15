
-- The previous migration failed because the 'clip_files' bucket already exists.
-- This script will clean up the incorrect 'clips' bucket and its policies,
-- and then set up the correct policies for the existing 'clip_files' bucket.

-- Drop the policies created for the 'clips' bucket in a previous migration
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Delete the incorrect 'clips' bucket
DELETE FROM storage.buckets WHERE id = 'clips';

-- Now, create correctly named policies for the 'clip_files' bucket.
-- RLS Policy: Allow authenticated users to view their own files in the 'clip_files' bucket
CREATE POLICY "Users can view their own clip_files"
ON storage.objects FOR SELECT
USING (bucket_id = 'clip_files' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to upload files to the 'clip_files' bucket
CREATE POLICY "Users can upload to clip_files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clip_files' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to update their own files in 'clip_files'
CREATE POLICY "Users can update their own clip_files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clip_files' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to delete their own files from 'clip_files'
CREATE POLICY "Users can delete their own clip_files"
ON storage.objects FOR DELETE
USING (bucket_id = 'clip_files' AND auth.uid() = owner);
