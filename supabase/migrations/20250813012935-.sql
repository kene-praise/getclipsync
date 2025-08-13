-- Fix subscribers table RLS policies for better security
-- This addresses the critical finding about customer data exposure

-- Drop the overly permissive "System can insert/update subscriptions" policy
DROP POLICY IF EXISTS "System can insert/update subscriptions" ON public.subscribers;

-- Create more restrictive policies for subscription management

-- 1. Only authenticated users can insert their own subscription
CREATE POLICY "Users can create their own subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- 2. Service role can manage subscriptions (for payment processing)
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Admins can manage all subscriptions (for admin dashboard)
CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscribers 
FOR ALL
TO authenticated
USING (current_user_is_admin())
WITH CHECK (current_user_is_admin());