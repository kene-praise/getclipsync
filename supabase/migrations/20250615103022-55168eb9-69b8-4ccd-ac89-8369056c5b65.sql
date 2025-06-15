
-- Add user_id to clips table to associate clips with users.
-- If a user is deleted, their clips become anonymous (user_id is set to NULL).
ALTER TABLE public.clips
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create a table for public user profiles
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
  -- Future columns like full_name, avatar_url can be added here
);

-- Add Row Level Security (RLS) to the profiles table to protect user data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to view their own profile
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- RLS Policy: Allow users to update their own profile
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- This function runs automatically when a new user signs up in Supabase Auth
-- and creates a corresponding row in our public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- This trigger calls the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
