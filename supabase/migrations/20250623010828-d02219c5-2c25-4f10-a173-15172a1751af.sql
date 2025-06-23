
-- Create admin_users table to manage admin permissions
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows admins to view admin users
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR SELECT USING (email = auth.email());

-- Insert your email as the primary admin
INSERT INTO public.admin_users (email) VALUES ('praizzze4@gmail.com');

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email
  );
END;
$$;

-- Enhanced function to get admin stats with content data
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
          'id', c.id,
          'content_type', c.content_type,
          'text_content', CASE 
            WHEN c.content_type = 'text' THEN SUBSTRING(c.text_content FROM 1 FOR 100)
            ELSE NULL
          END,
          'file_name', c.file_name,
          'user_email', u.email,
          'created_at', c.created_at
        )
      ), '[]'::jsonb)
      FROM public.clips c
      LEFT JOIN auth.users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 10
    ),
    'recent_temp_clips', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'content_type', t.content_type,
          'text_content', CASE 
            WHEN t.content_type = 'text' THEN SUBSTRING(t.text_content FROM 1 FOR 100)
            ELSE NULL
          END,
          'file_name', t.file_name,
          'code', t.code,
          'created_at', t.created_at
        )
      ), '[]'::jsonb)
      FROM public.temporary_clips t
      ORDER BY t.created_at DESC
      LIMIT 10
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;
