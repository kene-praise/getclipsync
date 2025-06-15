
-- Phase 1: Database Schema Updates & Expiration Changes

-- 1. Update `clips` table default expiration to 30 days for logged-in users.
-- All new clips created by signed-in users will now expire after 30 days.
ALTER TABLE public.clips ALTER COLUMN expires_at SET DEFAULT (now() + '30 days'::interval);

-- 2. Update `temporary_clips` table default expiration to 1 hour for anonymous users.
-- All new clips shared anonymously will now expire after 1 hour.
ALTER TABLE public.temporary_clips ALTER COLUMN expires_at SET DEFAULT (now() + '1 hour'::interval);

-- 3. Create a cleanup function to automatically delete expired clips and their associated files from storage.
-- This keeps your storage usage optimized by removing old data.
CREATE OR REPLACE FUNCTION public.delete_expired_clips()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Ensures the function has permissions to delete from storage buckets
AS $$
BEGIN
  -- First, delete associated files for expired clips of logged-in users from storage.
  DELETE FROM storage.objects WHERE bucket_id = 'clip_files' AND name IN (
    SELECT file_path FROM public.clips WHERE expires_at < now() AND file_path IS NOT NULL
  );
  -- Then, delete the expired clip records from the database.
  DELETE FROM public.clips WHERE expires_at < now();

  -- First, delete associated files for expired temporary clips from storage.
  DELETE FROM storage.objects WHERE bucket_id = 'temporary_clips' AND name IN (
    -- This extracts the file path from the full public URL
    SELECT SUBSTRING(file_url FROM (POSITION('/temporary_clips/' IN file_url) + LENGTH('/temporary_clips/')))
    FROM public.temporary_clips
    WHERE expires_at < now() AND file_url IS NOT NULL
  );
  -- Then, delete the expired temporary clip records from the database.
  DELETE FROM public.temporary_clips WHERE expires_at < now();
END;
$$;

-- 4. Schedule the cleanup function to run daily.
-- This requires the pg_cron extension, which is available in Supabase.
-- It will automatically run the cleanup function every day at midnight UTC.
SELECT cron.schedule(
  'daily-clip-cleanup',
  '0 0 * * *', -- This is the cron syntax for "every day at midnight"
  'SELECT delete_expired_clips()'
);
