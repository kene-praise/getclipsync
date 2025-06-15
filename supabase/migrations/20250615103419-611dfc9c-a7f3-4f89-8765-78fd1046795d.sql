
-- Enable Row Level Security on the clips table to make clips private
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to view their own clips
CREATE POLICY "Users can view their own clips"
ON public.clips FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Allow users to create clips for themselves
CREATE POLICY "Users can insert their own clips"
ON public.clips FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Allow users to update their own clips
CREATE POLICY "Users can update their own clips"
ON public.clips FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policy: Allow users to delete their own clips
CREATE POLICY "Users can delete their own clips"
ON public.clips FOR DELETE
USING (auth.uid() = user_id);
