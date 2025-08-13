-- Fix user_analytics table RLS policies for better security
-- This addresses the security finding about user tracking data that could be harvested

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "System can insert analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;

-- Create more secure policies

-- 1. Only allow authenticated users to insert their own analytics data
CREATE POLICY "Users can insert their own analytics" 
ON public.user_analytics 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- 2. Allow service role to insert analytics (for system operations)
CREATE POLICY "Service role can insert analytics" 
ON public.user_analytics 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 3. Users can only view their own analytics data
CREATE POLICY "Users can view their own analytics" 
ON public.user_analytics 
FOR SELECT 
TO authenticated
USING (
  user_id = auth.uid()
);

-- 4. Admins can view all analytics for admin dashboard
CREATE POLICY "Admins can view all analytics" 
ON public.user_analytics 
FOR SELECT 
TO authenticated
USING (
  current_user_is_admin()
);

-- 5. No update or delete operations allowed (analytics should be immutable)
-- This prevents tampering with historical analytics data