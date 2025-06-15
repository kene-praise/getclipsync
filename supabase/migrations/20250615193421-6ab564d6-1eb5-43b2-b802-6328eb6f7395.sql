
CREATE OR REPLACE FUNCTION public.delete_expired_clips()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
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
