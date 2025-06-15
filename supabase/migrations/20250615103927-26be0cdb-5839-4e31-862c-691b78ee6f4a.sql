
-- Create a new storage bucket named 'clips' to store file-based clips
INSERT INTO storage.buckets (id, name, public)
VALUES ('clips', 'clips', false);

-- RLS Policy: Allow authenticated users to view their own files in the 'clips' bucket
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'clips' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to upload files to the 'clips' bucket
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clips' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clips' AND auth.uid() = owner);

-- RLS Policy: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'clips' AND auth.uid() = owner);
