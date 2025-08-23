-- Remove the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscribers;

-- Create more restrictive, operation-specific policies for service role

-- Allow service role to SELECT subscription data (needed for verification)
-- but only for existing records with valid user_id and email
CREATE POLICY "Service role can read subscription data" 
ON public.subscribers 
FOR SELECT 
TO service_role
USING (
  user_id IS NOT NULL 
  AND email IS NOT NULL
);

-- Allow service role to INSERT new subscription records  
-- but only with required fields populated and valid email format
CREATE POLICY "Service role can create subscription records" 
ON public.subscribers 
FOR INSERT 
TO service_role
WITH CHECK (
  user_id IS NOT NULL 
  AND email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Allow service role to UPDATE subscription records
-- but only for existing records with required fields
CREATE POLICY "Service role can update subscription status" 
ON public.subscribers 
FOR UPDATE 
TO service_role
USING (
  user_id IS NOT NULL 
  AND email IS NOT NULL
)
WITH CHECK (
  user_id IS NOT NULL 
  AND email IS NOT NULL
);