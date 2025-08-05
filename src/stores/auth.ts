import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types'
import { AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        loading: false,
        initialized: false,

        initialize: async () => {
          try {
            set({ loading: true })
            const supabase = createClient()
            
            // Get current session
            const { data: { session }, error } = await supabase.auth.getSession()
            
            if (error) {
              console.error('Error getting session:', error)
              set({ user: null, loading: false, initialized: true })
              return
            }

            if (session?.user) {
              // Fetch user profile from database
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (profileError) {
                console.error('Error fetching user profile:', profileError)
                set({ user: null, loading: false, initialized: true })
                return
              }

              set({ user: profile, loading: false, initialized: true })
            } else {
              set({ user: null, loading: false, initialized: true })
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                
                set({ user: profile, loading: false })
              } else if (event === 'SIGNED_OUT') {
                set({ user: null, loading: false })
              }
            })
          } catch (error) {
            console.error('Error initializing auth:', error)
            set({ user: null, loading: false, initialized: true })
          }
        },

        signIn: async (email: string, password: string) => {
          try {
            set({ loading: true })
            const supabase = createClient()
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })

            if (error) {
              throw error
            }

            if (data.user) {
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single()

              if (profileError) {
                throw profileError
              }

              set({ user: profile, loading: false })
            }
          } catch (error) {
            set({ loading: false })
            throw error
          }
        },

        signUp: async (email: string, password: string, fullName: string) => {
          try {
            set({ loading: true })
            const supabase = createClient()
            
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                },
              },
            })

            if (error) {
              throw error
            }

            // User profile will be created via database trigger
            set({ loading: false })
          } catch (error) {
            set({ loading: false })
            throw error
          }
        },

        signOut: async () => {
          try {
            set({ loading: true })
            const supabase = createClient()
            
            const { error } = await supabase.auth.signOut()
            
            if (error) {
              throw error
            }

            set({ user: null, loading: false })
          } catch (error) {
            set({ loading: false })
            throw error
          }
        },

        updateProfile: async (updates: Partial<User>) => {
          try {
            const { user } = get()
            if (!user) throw new Error('No user logged in')

            set({ loading: true })
            const supabase = createClient()
            
            const { data, error } = await supabase
              .from('users')
              .update(updates)
              .eq('id', user.id)
              .select()
              .single()

            if (error) {
              throw error
            }

            set({ user: data, loading: false })
          } catch (error) {
            set({ loading: false })
            throw error
          }
        },

        resetPassword: async (email: string) => {
          try {
            set({ loading: true })
            const supabase = createClient()
            
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) {
              throw error
            }

            set({ loading: false })
          } catch (error) {
            set({ loading: false })
            throw error
          }
        },

        setUser: (user: User | null) => set({ user }),
        setLoading: (loading: boolean) => set({ loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)