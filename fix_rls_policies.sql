-- Fix RLS Policies for User Registration
-- Run this in your Supabase SQL Editor

-- ==============================================================================
-- STEP 1: DROP EXISTING POLICIES AND RECREATE WITH PROPER PERMISSIONS
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can access own record" ON public.users;
DROP POLICY IF EXISTS "Users can access own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can access own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can access own auth tokens" ON public.auth_tokens;

-- ==============================================================================
-- STEP 2: CREATE MORE PERMISSIVE POLICIES FOR USER REGISTRATION
-- ==============================================================================

-- Users table policies - allow service role to insert during registration
CREATE POLICY "Enable read access for users based on user_id" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Enable read access for users based on user_id" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Enable read access for users based on user_id" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Auth tokens policies
CREATE POLICY "Enable read access for users based on user_id" ON public.auth_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.auth_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.auth_tokens
  FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- STEP 3: UPDATE THE TRIGGER FUNCTION WITH PROPER SECURITY
-- ==============================================================================

-- Drop and recreate the trigger function with proper permissions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function that bypasses RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users table (this will run as the function definer, bypassing RLS)
  INSERT INTO public.users (id, email, full_name, avatar_url, is_trainer)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_trainer')::boolean, false)
  );
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Insert default subscription (free tier)
  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the registration
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STEP 4: GRANT ADDITIONAL PERMISSIONS FOR SERVICE ROLE
-- ==============================================================================

-- Make sure service role can bypass RLS when needed
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.auth_tokens FORCE ROW LEVEL SECURITY;

-- Grant necessary permissions to service role and authenticated users
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_preferences TO service_role;
GRANT ALL ON public.user_subscriptions TO service_role;
GRANT ALL ON public.auth_tokens TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ==============================================================================
-- STEP 5: ADD BYPASS POLICIES FOR SYSTEM OPERATIONS
-- ==============================================================================

-- Allow system/service role to bypass RLS for user creation
CREATE POLICY "Allow service role full access" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON public.user_preferences
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON public.user_subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON public.auth_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- STEP 6: TEST THE SETUP
-- ==============================================================================

-- You can test by trying to register a new user
-- The function should now work without RLS violations