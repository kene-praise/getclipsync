
-- Create a SECURITY DEFINER function to insert a temporary clip and return its id
-- This avoids needing a SELECT policy on temporary_clips after insert.
CREATE OR REPLACE FUNCTION public.create_temporary_clip(
  p_code text,
  p_text_content text,
  p_content_type text,
  p_has_files boolean
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.temporary_clips (code, text_content, content_type, has_files)
  VALUES (p_code, p_text_content, p_content_type, COALESCE(p_has_files, false))
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
