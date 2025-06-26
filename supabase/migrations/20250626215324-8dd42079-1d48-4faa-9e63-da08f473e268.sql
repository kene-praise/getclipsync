
-- Create privacy-compliant admin analytics functions
CREATE OR REPLACE FUNCTION public.get_signup_analytics(period_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', date_series,
        'signups', COALESCE(signup_counts.count, 0)
      )
      ORDER BY date_series
    )
    FROM (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '1 day' * period_days,
        CURRENT_DATE,
        '1 day'::interval
      )::date AS date_series
    ) dates
    LEFT JOIN (
      SELECT 
        created_at::date as signup_date,
        COUNT(*) as count
      FROM auth.users
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * period_days
      GROUP BY created_at::date
    ) signup_counts ON dates.date_series = signup_counts.signup_date
  );
END;
$$;

-- Create clip creation analytics function
CREATE OR REPLACE FUNCTION public.get_clip_analytics(period_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', date_series,
        'clips', COALESCE(clip_counts.count, 0)
      )
      ORDER BY date_series
    )
    FROM (
      SELECT generate_series(
        CURRENT_DATE - INTERVAL '1 day' * period_days,
        CURRENT_DATE,
        '1 day'::interval
      )::date AS date_series
    ) dates
    LEFT JOIN (
      SELECT 
        created_at::date as clip_date,
        COUNT(*) as count
      FROM public.clips
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * period_days
      GROUP BY created_at::date
    ) clip_counts ON dates.date_series = clip_counts.clip_date
  );
END;
$$;

-- Create content type distribution function
CREATE OR REPLACE FUNCTION public.get_content_type_distribution()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'type', content_type,
        'count', count,
        'percentage', ROUND((count * 100.0 / total_count), 2)
      )
    )
    FROM (
      SELECT 
        content_type,
        COUNT(*) as count,
        SUM(COUNT(*)) OVER() as total_count
      FROM (
        SELECT content_type FROM public.clips
        UNION ALL
        SELECT content_type FROM public.temporary_clips
      ) all_clips
      GROUP BY content_type
    ) stats
  );
END;
$$;

-- Create privacy-compliant admin stats function (without sensitive content)
CREATE OR REPLACE FUNCTION public.get_privacy_compliant_admin_stats()
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
    'new_users_today', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= CURRENT_DATE
    ),
    'clips_created_today', (
      SELECT COUNT(*) FROM public.clips 
      WHERE created_at >= CURRENT_DATE
    ),
    'temp_clips_created_today', (
      SELECT COUNT(*) FROM public.temporary_clips 
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
    'content_type_stats', (
      SELECT jsonb_build_object(
        'text_clips', (SELECT COUNT(*) FROM public.clips WHERE content_type = 'text'),
        'file_clips', (SELECT COUNT(*) FROM public.clips WHERE content_type = 'file'),
        'text_temp_clips', (SELECT COUNT(*) FROM public.temporary_clips WHERE content_type = 'text'),
        'file_temp_clips', (SELECT COUNT(*) FROM public.temporary_clips WHERE content_type = 'file')
      )
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;
