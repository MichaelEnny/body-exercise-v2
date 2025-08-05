import { supabase, createServerSupabaseClient } from './supabase'
import type { Database } from './database.types'
import type { 
  UserPreferences, 
  UserSession, 
  UserSubscription, 
  AuthToken, 
  UserProfileExtended,
  TrainerBusinessProfile,
  ClientInvitation
} from '../types'

// ==============================================================================
// USER PROFILE MANAGEMENT
// ==============================================================================

/**
 * Gets complete user profile with all related data
 */
export const getCompleteUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_preferences (*),
      user_profiles_extended (*),
      user_subscriptions (*),
      trainer_profiles (
        *,
        trainer_business_profiles (*)
      )
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Updates user preferences
 */
export const updateUserPreferences = async (
  userId: string, 
  preferences: Partial<Database['public']['Tables']['user_preferences']['Update']>
) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Updates extended user profile
 */
export const updateExtendedProfile = async (
  userId: string,
  profileData: Partial<Database['public']['Tables']['user_profiles_extended']['Update']>
) => {
  const { data, error } = await supabase
    .from('user_profiles_extended')
    .update(profileData)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mark user onboarding as complete
 */
export const completeOnboarding = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles_extended')
    .update({
      onboarding_completed: true,
      profile_completed: true
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ==============================================================================
// SUBSCRIPTION MANAGEMENT
// ==============================================================================

/**
 * Gets user subscription with feature limits
 */
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data
}

/**
 * Gets subscription limits using database function
 */
export const getSubscriptionLimits = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('get_user_subscription_limits', { user_uuid: userId })

  if (error) throw error
  return data?.[0] || null
}

/**
 * Updates subscription status (typically called by Stripe webhooks)
 */
export const updateSubscriptionStatus = async (
  userId: string,
  subscriptionData: Partial<Database['public']['Tables']['user_subscriptions']['Update']>
) => {
  const serverClient = createServerSupabaseClient()
  
  const { data, error } = await serverClient
    .from('user_subscriptions')
    .update(subscriptionData)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Check if user has reached feature limit
 */
export const checkFeatureLimit = async (
  userId: string,
  feature: 'workouts' | 'devices' | 'clients'
) => {
  const limits = await getSubscriptionLimits(userId)
  if (!limits) return { allowed: false, current: 0, limit: 0 }

  let currentCount = 0
  let limit = 0

  switch (feature) {
    case 'workouts':
      limit = limits.workout_limit || 0
      if (limits.has_unlimited_workouts) return { allowed: true, current: 0, limit: -1 }
      
      const { count: workoutCount } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_template', false)
      
      currentCount = workoutCount || 0
      break

    case 'devices':
      limit = limits.device_sync_limit || 0
      if (limits.has_unlimited_devices) return { allowed: true, current: 0, limit: -1 }
      
      const { count: deviceCount } = await supabase
        .from('device_syncs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('sync_status', 'active')
      
      currentCount = deviceCount || 0
      break

    case 'clients':
      limit = limits.client_limit || 0
      if (limits.has_unlimited_clients) return { allowed: true, current: 0, limit: -1 }
      
      const { count: clientCount } = await supabase
        .from('trainer_client_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', userId)
        .in('status', ['active', 'pending'])
      
      currentCount = clientCount || 0
      break
  }

  return {
    allowed: currentCount < limit,
    current: currentCount,
    limit
  }
}

// ==============================================================================
// SESSION MANAGEMENT
// ==============================================================================

/**
 * Create user session record
 */
export const createUserSession = async (sessionData: {
  user_id: string
  session_token: string
  expires_at: string
  ip_address?: string
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  login_method?: 'email' | 'google' | 'apple' | 'magic_link'
}) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .insert(sessionData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update session activity
 */
export const updateSessionActivity = async (sessionToken: string) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('session_token', sessionToken)
    .eq('is_active', true)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * End user session
 */
export const endUserSession = async (sessionToken: string) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .update({ is_active: false })
    .eq('session_token', sessionToken)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get active user sessions
 */
export const getActiveSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .order('last_activity', { ascending: false })

  if (error) throw error
  return data
}

// ==============================================================================
// AUTHENTICATION TOKEN MANAGEMENT
// ==============================================================================

/**
 * Create authentication token (email verification, password reset, etc.)
 */
export const createAuthToken = async (tokenData: {
  user_id: string
  token_hash: string
  token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
  email?: string
  expires_at: string
  ip_address?: string
  user_agent?: string
}) => {
  const serverClient = createServerSupabaseClient()
  
  const { data, error } = await serverClient
    .from('auth_tokens')
    .insert(tokenData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Verify and use authentication token
 */
export const verifyAuthToken = async (
  tokenHash: string, 
  tokenType: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
) => {
  const serverClient = createServerSupabaseClient()
  
  // Get the token
  const { data: token, error: fetchError } = await serverClient
    .from('auth_tokens')
    .select('*')
    .eq('token_hash', tokenHash)
    .eq('token_type', tokenType)
    .eq('is_used', false)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (fetchError) throw fetchError
  if (!token) throw new Error('Invalid or expired token')

  // Check attempt limits
  if (token.attempts && token.max_attempts && token.attempts >= token.max_attempts) {
    throw new Error('Too many attempts')
  }

  // Mark token as used
  const { data: updatedToken, error: updateError } = await serverClient
    .from('auth_tokens')
    .update({
      is_used: true,
      used_at: new Date().toISOString(),
      attempts: (token.attempts || 0) + 1
    })
    .eq('id', token.id)
    .select()
    .single()

  if (updateError) throw updateError
  return updatedToken
}

// ==============================================================================
// TRAINER FUNCTIONALITY
// ==============================================================================

/**
 * Create trainer profile using database function
 */
export const createTrainerProfile = async (
  userId: string,
  businessName?: string,
  bio?: string
) => {
  const { data, error } = await supabase
    .rpc('create_trainer_profile', {
      user_uuid: userId,
      business_name_param: businessName,
      bio_param: bio
    })

  if (error) throw error
  return data
}

/**
 * Update trainer business profile
 */
export const updateTrainerBusinessProfile = async (
  trainerProfileId: string,
  businessData: Partial<Database['public']['Tables']['trainer_business_profiles']['Update']>
) => {
  const { data, error } = await supabase
    .from('trainer_business_profiles')
    .update(businessData)
    .eq('trainer_profile_id', trainerProfileId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Send client invitation
 */
export const sendClientInvitation = async (invitationData: {
  trainer_id: string
  email: string
  first_name?: string
  last_name?: string
  message?: string
  token_hash: string
  expires_at: string
}) => {
  const { data, error } = await supabase
    .from('client_invitations')
    .insert(invitationData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Accept client invitation
 */
export const acceptClientInvitation = async (
  tokenHash: string,
  clientId: string
) => {
  const { data, error } = await supabase
    .from('client_invitations')
    .update({
      status: 'accepted',
      client_id: clientId,
      accepted_at: new Date().toISOString()
    })
    .eq('token_hash', tokenHash)
    .eq('status', 'pending')
    .gte('expires_at', new Date().toISOString())
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get trainer's client invitations
 */
export const getTrainerInvitations = async (trainerId: string) => {
  const { data, error } = await supabase
    .from('client_invitations')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ==============================================================================
// USER CONNECTIONS (SOCIAL FEATURES)
// ==============================================================================

/**
 * Send connection request
 */
export const sendConnectionRequest = async (
  requesterId: string,
  addresseeId: string,
  connectionType: 'friend' | 'trainer' | 'client' = 'friend',
  notes?: string
) => {
  const { data, error } = await supabase
    .from('user_connections')
    .insert({
      requester_id: requesterId,
      addressee_id: addresseeId,
      connection_type: connectionType,
      status: 'pending',
      notes
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Respond to connection request
 */
export const respondToConnectionRequest = async (
  connectionId: string,
  response: 'accepted' | 'declined'
) => {
  const { data, error } = await supabase
    .from('user_connections')
    .update({
      status: response,
      responded_at: new Date().toISOString()
    })
    .eq('id', connectionId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get user connections
 */
export const getUserConnections = async (
  userId: string,
  status?: 'pending' | 'accepted' | 'declined' | 'blocked'
) => {
  let query = supabase
    .from('user_connections')
    .select(`
      *,
      requester:users!user_connections_requester_id_fkey(id, full_name, avatar_url),
      addressee:users!user_connections_addressee_id_fkey(id, full_name, avatar_url)
    `)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ==============================================================================
// ACTIVITY LOGGING
// ==============================================================================

/**
 * Log user activity
 */
export const logUserActivity = async (activityData: {
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  session_id?: string
  metadata?: Record<string, any>
}) => {
  const { data, error } = await supabase
    .from('user_activity_log')
    .insert(activityData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get user activity history
 */
export const getUserActivityHistory = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const { data, error } = await supabase
    .from('user_activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// ==============================================================================
// MAINTENANCE FUNCTIONS
// ==============================================================================

/**
 * Cleanup expired tokens (should be run periodically)
 */
export const cleanupExpiredTokens = async () => {
  const serverClient = createServerSupabaseClient()
  
  const { data, error } = await serverClient
    .rpc('cleanup_expired_tokens')

  if (error) throw error
  return data
}

/**
 * Cleanup expired sessions (should be run periodically)
 */
export const cleanupExpiredSessions = async () => {
  const serverClient = createServerSupabaseClient()
  
  const { data, error } = await serverClient
    .rpc('cleanup_expired_sessions')

  if (error) throw error
  return data
}

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

/**
 * Generate secure token hash
 */
export const generateTokenHash = (token: string): string => {
  // In production, use a proper hashing library like bcrypt or argon2
  // This is a simplified example
  return Buffer.from(token).toString('base64')
}

/**
 * Generate random token
 */
export const generateRandomToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/**
 * Check if user is trainer
 */
export const isUserTrainer = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('is_trainer')
    .eq('id', userId)
    .single()

  if (error) return false
  return data?.is_trainer || false
}

/**
 * Get user's subscription tier
 */
export const getUserTier = async (userId: string): Promise<'free' | 'pro' | 'enterprise'> => {
  const subscription = await getUserSubscription(userId)
  return subscription?.tier || 'free'
}