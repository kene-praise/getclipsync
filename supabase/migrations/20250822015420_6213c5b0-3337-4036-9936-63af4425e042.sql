-- Drop existing potentially vulnerable RLS policies for subscribers table
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can create their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscribers;

-- Create secure RLS policies that explicitly require authentication
-- and prevent any access to sensitive data by anonymous users

-- Policy for authenticated users to view only their own subscription data
CREATE POLICY "Authenticated users can view own subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy for authenticated users to update only their own subscription data
CREATE POLICY "Authenticated users can update own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy for authenticated users to insert their own subscription data
CREATE POLICY "Authenticated users can create own subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Policy for service role (used by edge functions) to manage all subscriptions
-- This is needed for backend processes like webhooks and subscription updates
CREATE POLICY "Service role can manage all subscriptions" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Policy for admin users to manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscribers 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND current_user_is_admin()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND current_user_is_admin()
);

-- Ensure no data can be accessed by anonymous users (explicit deny policy)
CREATE POLICY "Deny all access to anonymous users" 
ON public.subscribers 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);