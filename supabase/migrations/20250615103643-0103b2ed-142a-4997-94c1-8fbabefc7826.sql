
-- Drop the index on the 'code' column as it's no longer needed
DROP INDEX IF EXISTS public.idx_clips_code;

-- Remove the 'code' column from the 'clips' table as it's obsolete
ALTER TABLE public.clips
DROP COLUMN code;
