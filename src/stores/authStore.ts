import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { User as AppUser } from '@/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  userProfile: AppUser | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AppUser>) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true })
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select(`
            *,
            trainer_profiles (*)
          `)
          .eq('id', session.user.id)
          .single()

        set({ 
          user: session.user, 
          userProfile: profile,
          initialized: true,
          loading: false 
        })
      } else {
        set({ 
          user: null, 
          userProfile: null, 
          initialized: true,
          loading: false 
        })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select(`
              *,
              trainer_profiles (*)
            `)
            .eq('id', session.user.id)
            .single()

          set({ user: session.user, userProfile: profile })
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, userProfile: null })
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false, initialized: true })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Profile will be loaded by the auth state change listener
      set({ loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string, userData: Partial<AppUser>) => {
    try {
      set({ loading: true })

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.full_name,
            subscription_tier: 'free',
            subscription_status: 'active',
            is_trainer: userData.is_trainer || false
          })

        if (profileError) throw profileError

        // If user is a trainer, create trainer profile
        if (userData.is_trainer && userData.trainer_profile) {
          const { user_id, ...trainerProfileData } = userData.trainer_profile
          const { error: trainerError } = await supabase
            .from('trainer_profiles')
            .insert({
              user_id: data.user.id,
              ...trainerProfileData
            })

          if (trainerError) throw trainerError
        }
      }

      set({ loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, userProfile: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  updateProfile: async (updates: Partial<AppUser>) => {
    try {
      const { user } = get()
      if (!user) throw new Error('No authenticated user')

      set({ loading: true })

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      const { userProfile } = get()
      if (userProfile) {
        set({ userProfile: { ...userProfile, ...updates }, loading: false })
      }
    } catch (error) {
      set({ loading: false })
      throw error
    }
  }
}))