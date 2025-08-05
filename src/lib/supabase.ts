import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    headers: {
      'X-Client-Info': 'fitplatform-web'
    }
  }
})

// Create a server-side client for server components
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Re-export Database type for convenience
export type { Database } from './database.types'

// Authentication helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async (options?: {
  user_id?: string
  ip_address?: string
  user_agent?: string
}) => {
  const { error } = await supabase.auth.signOut()
  
  if (error) throw error
  
  // Log sign out
  if (options?.user_id) {
    await logUserActivity({
      user_id: options.user_id,
      action: 'user_signed_out',
      ip_address: options.ip_address,
      user_agent: options.user_agent
    })
  }
}

// Enhanced social login helpers with activity logging
export const signInWithGoogle = async (options?: {
  ip_address?: string
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
}) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read'
    }
  })
  
  if (error) throw error
  
  // Log sign-in attempt
  if (options) {
    await logUserActivity({
      action: 'google_signin_initiated',
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      metadata: {
        provider: 'google',
        device_type: options.device_type
      }
    })
  }
  
  return data
}

export const signInWithApple = async (options?: {
  ip_address?: string
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
}) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })
  
  if (error) throw error
  
  // Log sign-in attempt
  if (options) {
    await logUserActivity({
      action: 'apple_signin_initiated',
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      metadata: {
        provider: 'apple',
        device_type: options.device_type
      }
    })
  }
  
  return data
}

// Email/Password authentication
export const signInWithEmail = async (
  email: string, 
  password: string,
  options?: {
    ip_address?: string
    user_agent?: string
    device_type?: 'mobile' | 'tablet' | 'desktop'
  }
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    // Log failed sign-in attempt
    await logUserActivity({
      action: 'email_signin_failed',
      ip_address: options?.ip_address,
      user_agent: options?.user_agent,
      metadata: {
        email,
        error_code: error.message,
        device_type: options?.device_type
      }
    })
    throw error
  }
  
  // Log successful sign-in
  if (data.user && options) {
    await logUserActivity({
      user_id: data.user.id,
      action: 'email_signin_success',
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      metadata: {
        provider: 'email',
        device_type: options.device_type
      }
    })
  }
  
  return data
}

// Email registration
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData?: {
    full_name?: string
    is_trainer?: boolean
  },
  options?: {
    ip_address?: string
    user_agent?: string
    device_type?: 'mobile' | 'tablet' | 'desktop'
  }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData || {}
    }
  })
  
  if (error) {
    // Log failed registration attempt
    await logUserActivity({
      action: 'email_signup_failed',
      ip_address: options?.ip_address,
      user_agent: options?.user_agent,
      metadata: {
        email,
        error_code: error.message,
        device_type: options?.device_type
      }
    })
    throw error
  }
  
  // Log successful registration
  if (data.user && options) {
    await logUserActivity({
      user_id: data.user.id,
      action: 'email_signup_success',
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      metadata: {
        email,
        is_trainer: userData?.is_trainer || false,
        device_type: options.device_type
      }
    })
  }
  
  return data
}

// Magic link authentication
export const signInWithMagicLink = async (
  email: string,
  options?: {
    ip_address?: string
    user_agent?: string
    device_type?: 'mobile' | 'tablet' | 'desktop'
  }
) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })
  
  if (error) throw error
  
  // Log magic link request
  if (options) {
    await logUserActivity({
      action: 'magic_link_requested',
      ip_address: options.ip_address,
      user_agent: options.user_agent,
      metadata: {
        email,
        device_type: options.device_type
      }
    })
  }
  
  return data
}

// Enhanced authentication event handlers
export const handleAuthStateChange = (event: string, session: any) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // Log user sign in activity
    logUserActivity({
      user_id: session.user.id,
      action: 'user_signed_in',
      metadata: {
        provider: session.user.app_metadata?.provider || 'email'
      }
    }).catch(console.error)
  } else if (event === 'SIGNED_OUT') {
    // Clear any client-side caches or state
    console.log('User signed out')
  }
}

// Set up auth state listener
supabase.auth.onAuthStateChange(handleAuthStateChange)

// User profile management with enhanced features
export const createUserProfile = async (userData: {
  id: string
  email: string
  full_name?: string
  is_trainer?: boolean
  subscription_tier?: 'free' | 'pro' | 'enterprise'
  provider?: string
  ip_address?: string
  user_agent?: string
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name || null,
      subscription_tier: userData.subscription_tier || 'free',
      subscription_status: 'active',
      is_trainer: userData.is_trainer || false
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Log profile creation
  await logUserActivity({
    user_id: userData.id,
    action: 'profile_created',
    resource_type: 'user',
    resource_id: userData.id,
    ip_address: userData.ip_address,
    user_agent: userData.user_agent,
    metadata: {
      provider: userData.provider || 'email',
      is_trainer: userData.is_trainer || false
    }
  })
  
  return data
}

export const getUserProfile = async (userId: string) => {
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

export const updateUserProfile = async (
  userId: string, 
  updates: any,
  metadata?: Record<string, any>
) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  // Log profile update
  await logUserActivity({
    user_id: userId,
    action: 'profile_updated',
    resource_type: 'user',
    resource_id: userId,
    metadata: {
      fields_updated: Object.keys(updates),
      ...metadata
    }
  })
  
  return data
}

// Import the activity logging function
import { logUserActivity } from './auth-helpers'