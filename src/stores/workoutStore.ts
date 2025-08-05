import { create } from 'zustand'
import { Workout, WorkoutSession, Exercise } from '@/types'
import { supabase } from '@/lib/supabase'

interface WorkoutState {
  workouts: Workout[]
  currentWorkout: Workout | null
  activeSession: WorkoutSession | null
  recentSessions: WorkoutSession[]
  loading: boolean
  
  // Workout management
  loadWorkouts: (userId: string) => Promise<void>
  createWorkout: (workout: Partial<Workout>) => Promise<Workout>
  updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  duplicateWorkout: (id: string) => Promise<Workout>
  
  // Workout sessions
  startWorkoutSession: (workoutId: string) => Promise<WorkoutSession>
  updateWorkoutSession: (sessionId: string, updates: Partial<WorkoutSession>) => Promise<void>
  completeWorkoutSession: (sessionId: string) => Promise<void>
  loadRecentSessions: (userId: string, limit?: number) => Promise<void>
  
  // Template management
  loadPublicTemplates: () => Promise<void>
  saveAsTemplate: (workoutId: string) => Promise<void>
  
  // State management
  setCurrentWorkout: (workout: Workout | null) => void
  clearActiveSession: () => void
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  activeSession: null,
  recentSessions: [],
  loading: false,

  loadWorkouts: async (userId: string) => {
    try {
      set({ loading: true })
      
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      set({ workouts: data || [], loading: false })
    } catch (error) {
      console.error('Error loading workouts:', error)
      set({ loading: false })
      throw error
    }
  },

  createWorkout: async (workout: Partial<Workout>) => {
    try {
      set({ loading: true })

      const { data, error } = await supabase
        .from('workouts')
        .insert({
          ...workout,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      const { workouts } = get()
      set({ 
        workouts: [data, ...workouts],
        loading: false 
      })

      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  updateWorkout: async (id: string, updates: Partial<Workout>) => {
    try {
      set({ loading: true })

      const { error } = await supabase
        .from('workouts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      const { workouts } = get()
      const updatedWorkouts = workouts.map(w => 
        w.id === id ? { ...w, ...updates } : w
      )

      set({ 
        workouts: updatedWorkouts,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  deleteWorkout: async (id: string) => {
    try {
      set({ loading: true })

      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)

      if (error) throw error

      const { workouts } = get()
      set({ 
        workouts: workouts.filter(w => w.id !== id),
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  duplicateWorkout: async (id: string) => {
    try {
      const { workouts } = get()
      const originalWorkout = workouts.find(w => w.id === id)
      
      if (!originalWorkout) throw new Error('Workout not found')

      const duplicatedWorkout = await get().createWorkout({
        ...originalWorkout,
        name: `${originalWorkout.name} (Copy)`,
        id: undefined, // Will be generated
        created_at: undefined,
        updated_at: undefined
      })

      return duplicatedWorkout
    } catch (error) {
      throw error
    }
  },

  startWorkoutSession: async (workoutId: string) => {
    try {
      set({ loading: true })

      const sessionData = {
        id: crypto.randomUUID(),
        workout_id: workoutId,
        started_at: new Date().toISOString(),
        exercises_completed: [],
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(sessionData)
        .select()
        .single()

      if (error) throw error

      set({ 
        activeSession: data,
        loading: false 
      })

      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  updateWorkoutSession: async (sessionId: string, updates: Partial<WorkoutSession>) => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId)

      if (error) throw error

      const { activeSession } = get()
      if (activeSession && activeSession.id === sessionId) {
        set({ activeSession: { ...activeSession, ...updates } })
      }
    } catch (error) {
      throw error
    }
  },

  completeWorkoutSession: async (sessionId: string) => {
    try {
      const completedAt = new Date().toISOString()
      
      await get().updateWorkoutSession(sessionId, {
        completed_at: completedAt
      })

      set({ activeSession: null })
    } catch (error) {
      throw error
    }
  },

  loadRecentSessions: async (userId: string, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workouts (
            name,
            workout_type
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      set({ recentSessions: data || [] })
    } catch (error) {
      console.error('Error loading recent sessions:', error)
      throw error
    }
  },

  loadPublicTemplates: async () => {
    try {
      set({ loading: true })

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('is_public', true)
        .eq('is_template', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Store public templates separately or merge with workouts
      // For now, we'll just log them
      console.log('Public templates:', data)
      
      set({ loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  saveAsTemplate: async (workoutId: string) => {
    try {
      await get().updateWorkout(workoutId, {
        is_template: true
      })
    } catch (error) {
      throw error
    }
  },

  setCurrentWorkout: (workout: Workout | null) => {
    set({ currentWorkout: workout })
  },

  clearActiveSession: () => {
    set({ activeSession: null })
  }
}))