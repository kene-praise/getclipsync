-- Remove overly permissive RLS policies for temporary clips
DROP POLICY IF EXISTS "Public can view temporary clips" ON public.temporary_clips;
DROP POLICY IF EXISTS "Public can view temporary clip files" ON public.temporary_clip_files;

-- Create secure function to get temporary clip by code
CREATE OR REPLACE FUNCTION public.get_temporary_clip_by_code(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clip_data jsonb;
  files_data jsonb;
BEGIN
  -- Check if code exists and hasn't expired
  SELECT jsonb_build_object(
    'id', id,
    'code', code,
    'text_content', text_content,
    'content_type', content_type,
    'has_files', has_files,
    'created_at', created_at,
    'expires_at', expires_at
  ) INTO clip_data
  FROM public.temporary_clips
  WHERE code = p_code 
    AND expires_at > now();

  -- If no clip found, return null
  IF clip_data IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get associated files if any
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', tcf.id,
      'file_name', tcf.file_name,
      'file_url', tcf.file_url,
      'file_size', tcf.file_size,
      'content_type', tcf.content_type,
      'created_at', tcf.created_at
    )
    ORDER BY tcf.created_at
  ), '[]'::jsonb) INTO files_data
  FROM public.temporary_clip_files tcf
  WHERE tcf.temporary_clip_id = (clip_data->>'id')::uuid;

  -- Combine clip data with files
  RETURN clip_data || jsonb_build_object('files', files_data);
END;
$$;

-- Create restrictive RLS policies (deny all direct access)
CREATE POLICY "Deny direct access to temporary clips" 
ON public.temporary_clips 
FOR SELECT 
USING (false);

CREATE POLICY "Deny direct access to temporary clip files" 
ON public.temporary_clip_files 
FOR SELECT 
USING (false);

-- Keep insert policies for creating clips
CREATE POLICY "Public can create temporary clips" 
ON public.temporary_clips 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can create temporary clip files" 
ON public.temporary_clip_files 
FOR INSERT 
WITH CHECK (true);