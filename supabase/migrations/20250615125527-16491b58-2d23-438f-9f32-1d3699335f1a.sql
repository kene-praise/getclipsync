
-- 1. Create a public bucket for temporary file uploads.
-- This bucket will store files for anonymous users for 24 hours.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('temporary_clips', 'temporary_clips', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'audio/mpeg'])
ON CONFLICT (id) DO NOTHING;

-- 2. Create the table for temporary clips
-- This table holds the content and metadata for shares made without an account.
CREATE TABLE IF NOT EXISTS public.temporary_clips (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    text_content text,
    file_url text,
    file_name text,
    content_type text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone NOT NULL DEFAULT (now() + '24:00:00'::interval),
    CONSTRAINT temporary_clips_pkey PRIMARY KEY (id)
);

-- Add indexes for faster lookups on code and for cleaning up expired clips.
CREATE INDEX IF NOT EXISTS idx_temporary_clips_code ON public.temporary_clips(code);
CREATE INDEX IF NOT EXISTS idx_temporary_clips_expires_at ON public.temporary_clips(expires_at);


-- 3. Enable Row Level Security for the temporary_clips table
ALTER TABLE public.temporary_clips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-runs.
DROP POLICY IF EXISTS "Public can view temporary clips" ON public.temporary_clips;
DROP POLICY IF EXISTS "Public can create temporary clips" ON public.temporary_clips;

-- Policies for temporary_clips table
CREATE POLICY "Public can view temporary clips" ON public.temporary_clips
FOR SELECT USING (true);

CREATE POLICY "Public can create temporary clips" ON public.temporary_clips
FOR INSERT WITH CHECK (true);


-- 4. Storage Policies for the 'temporary_clips' bucket
-- Drop existing policies if they exist to avoid conflicts.
DROP POLICY IF EXISTS "Public can upload to temporary_clips" ON storage.objects;
DROP POLICY IF EXISTS "Public can read from temporary_clips" ON storage.objects;

-- Allow anonymous users to upload files to the 'temporary_clips' bucket.
CREATE POLICY "Public can upload to temporary_clips"
ON storage.objects FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'temporary_clips' );

-- Allow public read access to files in the 'temporary_clips' bucket.
CREATE POLICY "Public can read from temporary_clips"
ON storage.objects FOR SELECT
USING ( bucket_id = 'temporary_clips' );

