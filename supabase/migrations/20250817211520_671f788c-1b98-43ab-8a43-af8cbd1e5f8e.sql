-- Fix file upload and storage issues
-- 1. Allow all file types and increase size limit for both buckets
-- 2. This enables multi-file uploads and removes MIME type restrictions

-- Update clip_files bucket (signed-in users)
UPDATE storage.buckets
SET 
  allowed_mime_types = NULL,  -- allow all file types
  file_size_limit = 25 * 1024 * 1024  -- 25MB per file
WHERE id = 'clip_files';

-- Update temporary_clips bucket (Quick Share)
UPDATE storage.buckets
SET 
  allowed_mime_types = NULL,  -- allow all file types  
  file_size_limit = 25 * 1024 * 1024  -- 25MB per file
WHERE id = 'temporary_clips';