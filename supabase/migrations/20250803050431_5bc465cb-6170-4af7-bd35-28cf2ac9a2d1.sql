-- Create clip_files table to support multiple files per clip
CREATE TABLE public.clip_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clip_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create temporary_clip_files table to support multiple files per temporary clip
CREATE TABLE public.temporary_clip_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  temporary_clip_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.clip_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temporary_clip_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for clip_files
CREATE POLICY "Users can view their own clip files"
ON public.clip_files
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.clips c 
    WHERE c.id = clip_files.clip_id 
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own clip files"
ON public.clip_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clips c 
    WHERE c.id = clip_files.clip_id 
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own clip files"
ON public.clip_files
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.clips c 
    WHERE c.id = clip_files.clip_id 
    AND c.user_id = auth.uid()
  )
);

-- RLS policies for temporary_clip_files (public access like temporary_clips)
CREATE POLICY "Public can view temporary clip files"
ON public.temporary_clip_files
FOR SELECT
USING (true);

CREATE POLICY "Public can create temporary clip files"
ON public.temporary_clip_files
FOR INSERT
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_clip_files_clip_id ON public.clip_files(clip_id);
CREATE INDEX idx_temporary_clip_files_temporary_clip_id ON public.temporary_clip_files(temporary_clip_id);

-- Add content_type column to clips and temporary_clips to support 'mixed' type
ALTER TABLE public.clips 
ADD COLUMN IF NOT EXISTS has_files BOOLEAN DEFAULT false;

ALTER TABLE public.temporary_clips 
ADD COLUMN IF NOT EXISTS has_files BOOLEAN DEFAULT false;