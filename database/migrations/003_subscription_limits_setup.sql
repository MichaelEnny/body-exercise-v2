-- FitPlatform Database Migration 003: Subscription Limits Setup
-- This file sets up default subscription tiers and limits based on business requirements

-- ==============================================================================
-- SET DEFAULT SUBSCRIPTION LIMITS
-- ==============================================================================

-- Update existing user_subscriptions to set proper limits based on tier
-- Free tier limits
UPDATE user_subscriptions 
SET 
  workout_limit = 3,
  device_sync_limit = 1,
  client_limit = 0
WHERE tier = 'free';

-- Pro tier limits  
UPDATE user_subscriptions 
SET 
  workout_limit = NULL, -- NULL = unlimited
  device_sync_limit = NULL, -- NULL = unlimited
  client_limit = 5 -- Pro trainers can have up to 5 clients
WHERE tier = 'pro';

-- Enterprise tier limits
UPDATE user_subscriptions 
SET 
  workout_limit = NULL, -- NULL = unlimited
  device_sync_limit = NULL, -- NULL = unlimited
  client_limit = NULL -- NULL = unlimited
WHERE tier = 'enterprise';

-- ==============================================================================
-- CREATE SUBSCRIPTION TIER TEMPLATE FUNCTION
-- ==============================================================================

-- Function to get default limits for a subscription tier
CREATE OR REPLACE FUNCTION get_tier_defaults(tier_name TEXT)
RETURNS TABLE(
  workout_limit INTEGER,
  device_sync_limit INTEGER,
  client_limit INTEGER,
  amount_cents INTEGER,
  interval_type TEXT
) AS $$
BEGIN
  CASE tier_name
    WHEN 'free' THEN
      RETURN QUERY SELECT 3, 1, 0, 0, 'month'::TEXT;
    WHEN 'pro' THEN
      RETURN QUERY SELECT NULL::INTEGER, NULL::INTEGER, 5, 999, 'month'::TEXT; -- $9.99/month
    WHEN 'enterprise' THEN
      RETURN QUERY SELECT NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 2999, 'month'::TEXT; -- $29.99/month
    ELSE
      RAISE EXCEPTION 'Unknown subscription tier: %', tier_name;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- ENHANCED SUBSCRIPTION MANAGEMENT FUNCTIONS
-- ==============================================================================

-- Function to upgrade user subscription
CREATE OR REPLACE FUNCTION upgrade_user_subscription(
  user_uuid UUID,
  new_tier TEXT,
  stripe_subscription_id_param TEXT DEFAULT NULL,
  stripe_price_id_param TEXT DEFAULT NULL,
  current_period_start_param TIMESTAMPTZ DEFAULT NOW(),
  current_period_end_param TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  subscription_id UUID;
  tier_defaults RECORD;
BEGIN
  -- Get tier defaults
  SELECT * INTO tier_defaults FROM get_tier_defaults(new_tier);
  
  -- Calculate period end if not provided
  IF current_period_end_param IS NULL THEN
    IF tier_defaults.interval_type = 'month' THEN
      current_period_end_param := current_period_start_param + INTERVAL '1 month';
    ELSE
      current_period_end_param := current_period_start_param + INTERVAL '1 year';
    END IF;
  END IF;
  
  -- Update or insert subscription
  INSERT INTO user_subscriptions (
    user_id,
    tier,
    status,
    stripe_subscription_id,
    stripe_price_id,
    current_period_start,
    current_period_end,
    amount_cents,
    currency,
    interval_type,
    workout_limit,
    device_sync_limit,
    client_limit
  ) VALUES (
    user_uuid,
    new_tier,
    'active',
    stripe_subscription_id_param,
    stripe_price_id_param,
    current_period_start_param,
    current_period_end_param,
    tier_defaults.amount_cents,
    'usd',
    tier_defaults.interval_type,
    tier_defaults.workout_limit,
    tier_defaults.device_sync_limit,
    tier_defaults.client_limit
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier = EXCLUDED.tier,
    status = EXCLUDED.status,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    stripe_price_id = EXCLUDED.stripe_price_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    amount_cents = EXCLUDED.amount_cents,
    interval_type = EXCLUDED.interval_type,
    workout_limit = EXCLUDED.workout_limit,
    device_sync_limit = EXCLUDED.device_sync_limit,
    client_limit = EXCLUDED.client_limit,
    updated_at = NOW()
  RETURNING id INTO subscription_id;
  
  -- Update users table tier for consistency
  UPDATE users 
  SET 
    subscription_tier = new_tier,
    subscription_status = 'active'
  WHERE id = user_uuid;
  
  -- Log the subscription change
  INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
  VALUES (
    user_uuid,
    'subscription_upgraded',
    'subscription',
    subscription_id::TEXT,
    json_build_object(
      'from_tier', (SELECT tier FROM user_subscriptions WHERE user_id = user_uuid AND id != subscription_id ORDER BY created_at DESC LIMIT 1),
      'to_tier', new_tier,
      'amount_cents', tier_defaults.amount_cents
    )
  );
  
  RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel user subscription
CREATE OR REPLACE FUNCTION cancel_user_subscription(
  user_uuid UUID,
  cancel_immediately BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
DECLARE
  subscription_record RECORD;
BEGIN
  -- Get current subscription
  SELECT * INTO subscription_record 
  FROM user_subscriptions 
  WHERE user_id = user_uuid AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active subscription found for user %', user_uuid;
  END IF;
  
  IF cancel_immediately THEN
    -- Cancel immediately
    UPDATE user_subscriptions 
    SET 
      status = 'canceled',
      canceled_at = NOW(),
      ended_at = NOW(),
      cancel_at_period_end = FALSE
    WHERE id = subscription_record.id;
    
    -- Downgrade to free tier immediately
    UPDATE users 
    SET 
      subscription_tier = 'free',
      subscription_status = 'active'
    WHERE id = user_uuid;
    
    -- Reset to free tier limits
    UPDATE user_subscriptions 
    SET 
      tier = 'free',
      workout_limit = 3,
      device_sync_limit = 1,
      client_limit = 0
    WHERE id = subscription_record.id;
  ELSE
    -- Cancel at period end
    UPDATE user_subscriptions 
    SET 
      cancel_at_period_end = TRUE,
      canceled_at = NOW()
    WHERE id = subscription_record.id;
  END IF;
  
  -- Log the cancellation
  INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, metadata)
  VALUES (
    user_uuid,
    'subscription_canceled',
    'subscription',
    subscription_record.id::TEXT,
    json_build_object(
      'tier', subscription_record.tier,
      'cancel_immediately', cancel_immediately,
      'period_end', subscription_record.current_period_end
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and enforce subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  user_uuid UUID,
  limit_type TEXT -- 'workouts', 'devices', 'clients'
)
RETURNS BOOLEAN AS $$
DECLARE
  limits_record RECORD;
  current_count INTEGER;
BEGIN
  -- Get user limits
  SELECT * INTO limits_record 
  FROM get_user_subscription_limits(user_uuid);
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check specific limit
  CASE limit_type
    WHEN 'workouts' THEN
      IF limits_record.has_unlimited_workouts THEN
        RETURN TRUE;
      END IF;
      
      SELECT COUNT(*) INTO current_count
      FROM workouts 
      WHERE user_id = user_uuid AND is_template = FALSE;
      
      RETURN current_count < COALESCE(limits_record.workout_limit, 0);
      
    WHEN 'devices' THEN
      IF limits_record.has_unlimited_devices THEN
        RETURN TRUE;
      END IF;
      
      SELECT COUNT(*) INTO current_count
      FROM device_syncs 
      WHERE user_id = user_uuid AND sync_status = 'active';
      
      RETURN current_count < COALESCE(limits_record.device_sync_limit, 0);
      
    WHEN 'clients' THEN
      IF limits_record.has_unlimited_clients THEN
        RETURN TRUE;
      END IF;
      
      SELECT COUNT(*) INTO current_count
      FROM trainer_client_relationships 
      WHERE trainer_id = user_uuid AND status IN ('active', 'pending');
      
      RETURN current_count < COALESCE(limits_record.client_limit, 0);
      
    ELSE
      RAISE EXCEPTION 'Unknown limit type: %', limit_type;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SUBSCRIPTION EXPIRY AND RENEWAL HANDLING
-- ==============================================================================

-- Function to handle subscription renewal
CREATE OR REPLACE FUNCTION handle_subscription_renewal(
  user_uuid UUID,
  new_period_start TIMESTAMPTZ,
  new_period_end TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  -- Update subscription period
  UPDATE user_subscriptions 
  SET 
    current_period_start = new_period_start,
    current_period_end = new_period_end,
    status = 'active',
    cancel_at_period_end = FALSE
  WHERE user_id = user_uuid;
  
  -- Log renewal
  INSERT INTO user_activity_log (user_id, action, resource_type, metadata)
  VALUES (
    user_uuid,
    'subscription_renewed',
    'subscription',
    json_build_object(
      'period_start', new_period_start,
      'period_end', new_period_end
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle subscription expiry
CREATE OR REPLACE FUNCTION handle_subscription_expiry(
  user_uuid UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update subscription status
  UPDATE user_subscriptions 
  SET 
    status = 'canceled',
    ended_at = NOW(),
    tier = 'free',
    workout_limit = 3,
    device_sync_limit = 1,
    client_limit = 0
  WHERE user_id = user_uuid;
  
  -- Update users table
  UPDATE users 
  SET 
    subscription_tier = 'free',
    subscription_status = 'active'
  WHERE id = user_uuid;
  
  -- Log expiry
  INSERT INTO user_activity_log (user_id, action, resource_type, metadata)
  VALUES (
    user_uuid,
    'subscription_expired',
    'subscription',
    json_build_object('downgraded_to', 'free')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- CREATE INDEXES FOR SUBSCRIPTION QUERIES
-- ==============================================================================

-- Index for subscription tier queries
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_status ON user_subscriptions(tier, status);

-- Index for expiring subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expiry ON user_subscriptions(current_period_end, status) 
WHERE status = 'active';

-- Index for canceled subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_canceled ON user_subscriptions(canceled_at, cancel_at_period_end) 
WHERE cancel_at_period_end = TRUE;

-- ==============================================================================
-- COMMENT DOCUMENTATION
-- ==============================================================================

COMMENT ON FUNCTION get_tier_defaults(TEXT) IS 'Returns default limits and pricing for a subscription tier';
COMMENT ON FUNCTION upgrade_user_subscription(UUID, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Upgrades user subscription to new tier with proper limits';
COMMENT ON FUNCTION cancel_user_subscription(UUID, BOOLEAN) IS 'Cancels user subscription immediately or at period end';
COMMENT ON FUNCTION check_subscription_limit(UUID, TEXT) IS 'Checks if user has reached their subscription limit for a feature';
COMMENT ON FUNCTION handle_subscription_renewal(UUID, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Handles subscription renewal from Stripe webhook';
COMMENT ON FUNCTION handle_subscription_expiry(UUID) IS 'Handles subscription expiry and downgrade to free tier';