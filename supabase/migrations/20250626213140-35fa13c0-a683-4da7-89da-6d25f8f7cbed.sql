
-- Fix the admin stats function to resolve GROUP BY errors
CREATE OR REPLACE FUNCTION public.get_admin_stats_with_content()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_clips', (SELECT COUNT(*) FROM public.clips),
    'total_temp_clips', (SELECT COUNT(*) FROM public.temporary_clips),
    'active_subscriptions', (SELECT COUNT(*) FROM public.subscribers WHERE subscribed = true),
    'new_users_today', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= CURRENT_DATE
    ),
    'clips_created_today', (
      SELECT COUNT(*) FROM public.clips 
      WHERE created_at >= CURRENT_DATE
    ),
    'storage_usage_mb', (
      SELECT COALESCE(SUM(
        CASE 
          WHEN metadata ? 'size' THEN (metadata->>'size')::bigint
          ELSE 0
        END
      ) / 1024 / 1024, 0)
      FROM storage.objects
    ),
    'recent_clips', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', clip_data.id,
          'content_type', clip_data.content_type,
          'text_content', clip_data.text_content,
          'file_name', clip_data.file_name,
          'user_email', clip_data.user_email,
          'created_at', clip_data.created_at
        )
      ), '[]'::jsonb)
      FROM (
        SELECT 
          c.id,
          c.content_type,
          CASE 
            WHEN c.content_type = 'text' THEN SUBSTRING(c.text_content FROM 1 FOR 100)
            ELSE NULL
          END as text_content,
          c.file_name,
          u.email as user_email,
          c.created_at
        FROM public.clips c
        LEFT JOIN auth.users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 10
      ) as clip_data
    ),
    'recent_temp_clips', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', temp_data.id,
          'content_type', temp_data.content_type,
          'text_content', temp_data.text_content,
          'file_name', temp_data.file_name,
          'code', temp_data.code,
          'created_at', temp_data.created_at
        )
      ), '[]'::jsonb)
      FROM (
        SELECT 
          t.id,
          t.content_type,
          CASE 
            WHEN t.content_type = 'text' THEN SUBSTRING(t.text_content FROM 1 FOR 100)
            ELSE NULL
          END as text_content,
          t.file_name,
          t.code,
          t.created_at
        FROM public.temporary_clips t
        ORDER BY t.created_at DESC
        LIMIT 10
      ) as temp_data
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;
