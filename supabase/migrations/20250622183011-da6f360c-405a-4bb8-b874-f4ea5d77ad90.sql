
-- Create a table to track user analytics and activity
CREATE TABLE public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'login', 'clip_created', 'clip_shared', 'file_uploaded'
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for system metrics
CREATE TABLE public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscribers table for Stripe integration
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT, -- 'basic', 'premium', 'enterprise'
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for user_analytics
CREATE POLICY "Users can view their own analytics" ON public.user_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON public.user_analytics
  FOR INSERT WITH CHECK (true);

-- Policies for system_metrics (allow authenticated users for now - we'll add admin role later)
CREATE POLICY "Authenticated users can view system metrics" ON public.system_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert metrics" ON public.system_metrics
  FOR INSERT WITH CHECK (true);

-- Policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
  FOR UPDATE USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "System can insert/update subscriptions" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- Function to track user events
CREATE OR REPLACE FUNCTION public.track_user_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.user_analytics (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
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
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;
