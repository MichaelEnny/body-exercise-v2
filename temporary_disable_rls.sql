-- Temporary fix: Disable RLS for testing (NOT for production!)
-- Run this ONLY for testing, re-enable RLS later

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_tokens DISABLE ROW LEVEL SECURITY;

-- Test user registration, then re-enable with:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;