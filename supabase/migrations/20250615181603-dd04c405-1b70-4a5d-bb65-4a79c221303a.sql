
-- Set replica identity to FULL to broadcast detailed changes for real-time updates
ALTER TABLE public.clips REPLICA IDENTITY FULL;

-- Add the clips table to the Supabase real-time publication
-- The DO-END block prevents an error if the table is already in the publication.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'clips'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clips;
  END IF;
END
$$;
