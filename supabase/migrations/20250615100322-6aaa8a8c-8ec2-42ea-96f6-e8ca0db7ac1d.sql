
-- Create a table to store clips data
CREATE TABLE public.clips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code text NOT NULL UNIQUE,
  content_type text NOT NULL CHECK (content_type IN ('text', 'file')),
  text_content text NULL,
  file_name text NULL,
  file_path text NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '24 hours'::interval)
);

-- Add an index on the 'code' column for faster lookups
CREATE INDEX idx_clips_code ON public.clips(code);

-- Add an index on 'expires_at' to efficiently find and clean up expired clips
CREATE INDEX idx_clips_expires_at ON public.clips(expires_at);

-- Enable Row Level Security for the 'clips' table
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- Create a policy that makes clips publicly accessible, as access is controlled by the unique code
CREATE POLICY "Clips are publicly accessible"
ON public.clips
FOR ALL
USING (true)
WITH CHECK (true);

-- Create a storage bucket named 'clip_files' for file transfers
-- This bucket is public, so files can be downloaded via a direct link
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('clip_files', 'clip_files', true, 104857600, NULL) -- 100MB limit as per spec
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow public access to all objects in the 'clip_files' bucket
CREATE POLICY "Public access for clip_files bucket"
ON storage.objects
FOR ALL
USING (bucket_id = 'clip_files');

