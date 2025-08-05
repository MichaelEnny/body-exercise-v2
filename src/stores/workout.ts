import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import { Workout, WorkoutFormData, WorkoutSession } from '@/types'
import { useAuthStore } from './auth'

interface WorkoutState {
  workouts: Workout[]
  currentWorkout: Workout | null
  currentSession: WorkoutSession | null
  loading: boolean
  
  // Actions
  fetchWorkouts: () => Promise<void>
  createWorkout: (workoutData: WorkoutFormData) => Promise<Workout>
  updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  duplicateWorkout: (id: string) => Promise<Workout>
  startWorkoutSession: (workoutId: string) => Promise<WorkoutSession>
  completeWorkoutSession: (sessionId: string, completedData: any) => Promise<void>
  pauseWorkoutSession: (sessionId: string) => Promise<void>
  resumeWorkoutSession: (sessionId: string) => Promise<void>
  setCurrentWorkout: (workout: Workout | null) => void
  setLoading: (loading: boolean) => void
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    (set, get) => ({
      workouts: [],
      currentWorkout: null,
      currentSession: null,
      loading: false,

      fetchWorkouts: async () => {
        try {
          const { user } = useAuthStore.getState()
          if (!user) throw new Error('No user logged in')

          set({ loading: true })
          
          const { data, error } = await supabase
            .from('workouts')
            .select(`
              *,
              exercises:workout_exercises(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            throw error
          }

          set({ workouts: data || [], loading: false })
        } catch (error) {
          console.error('Error fetching workouts:', error)
          set({ loading: false })
          throw error
        }
      },

      createWorkout: async (workoutData: WorkoutFormData) => {
        try {
          const { user } = useAuthStore.getState()
          if (!user) throw new Error('No user logged in')

          set({ loading: true })
          
          const workoutPayload = {
            user_id: user.id,
            name: workoutData.name,
            description: workoutData.description,
            difficulty_level: workoutData.difficulty_level,
            workout_type: workoutData.workout_type,
            tags: workoutData.tags,
            is_template: workoutData.is_template,
            is_public: workoutData.is_public,
          }

          const { data: workout, error: workoutError } = await supabase
            .from('workouts')
            .insert(workoutPayload)
            .select()
            .single()

          if (workoutError) {
            throw workoutError
          }

          // Add exercises to the workout
          const exercisePayloads = workoutData.exercises.map((exercise, index) => ({
            workout_id: workout.id,
            name: exercise.name,
            muscle_groups: exercise.muscle_groups,
            equipment_needed: exercise.equipment_needed,
            instructions: exercise.instructions,
            sets: exercise.sets,
            reps: exercise.reps,
            weight_kg: exercise.weight_kg,
            duration_seconds: exercise.duration_seconds,
            rest_seconds: exercise.rest_seconds,
            notes: exercise.notes,
            order_index: index,
          }))

          const { data: exercises, error: exercisesError } = await supabase
            .from('workout_exercises')
            .insert(exercisePayloads)
            .select()

          if (exercisesError) {
            throw exercisesError
          }

          const completeWorkout = {
            ...workout,
            exercises: exercises || [],
          }

          // Update local state
          const { workouts } = get()
          set({ 
            workouts: [completeWorkout, ...workouts],
            loading: false 
          })

          return completeWorkout
        } catch (error) {
          console.error('Error creating workout:', error)
          set({ loading: false })
          throw error
        }
      },

      updateWorkout: async (id: string, updates: Partial<Workout>) => {
        try {
          set({ loading: true })
          
          const { data, error } = await supabase
            .from('workouts')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (error) {
            throw error
          }

          // Update local state
          const { workouts } = get()
          const updatedWorkouts = workouts.map(w => 
            w.id === id ? { ...w, ...data } : w
          )
          
          set({ workouts: updatedWorkouts, loading: false })
        } catch (error) {
          console.error('Error updating workout:', error)
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

          if (error) {
            throw error
          }

          // Update local state
          const { workouts } = get()
          const filteredWorkouts = workouts.filter(w => w.id !== id)
          
          set({ workouts: filteredWorkouts, loading: false })
        } catch (error) {
          console.error('Error deleting workout:', error)
          set({ loading: false })
          throw error
        }
      },

      duplicateWorkout: async (id: string) => {
        try {
          const { user } = useAuthStore.getState()
          if (!user) throw new Error('No user logged in')

          set({ loading: true })
          
          // Get original workout with exercises
          const { data: originalWorkout, error: fetchError } = await supabase
            .from('workouts')
            .select(`
              *,
              exercises:workout_exercises(*)
            `)
            .eq('id', id)
            .single()

          if (fetchError) {
            throw fetchError
          }

          // Create duplicate workout
          const duplicateData = {
            user_id: user.id,
            name: `${originalWorkout.name} (Copy)`,
            description: originalWorkout.description,
            difficulty_level: originalWorkout.difficulty_level,
            workout_type: originalWorkout.workout_type,
            tags: originalWorkout.tags,
            is_template: originalWorkout.is_template,
            is_public: false, // Make copy private by default
          }

          const { data: newWorkout, error: createError } = await supabase
            .from('workouts')
            .insert(duplicateData)
            .select()
            .single()

          if (createError) {
            throw createError
          }

          // Duplicate exercises
          if (originalWorkout.exercises && originalWorkout.exercises.length > 0) {
            const exercisePayloads = originalWorkout.exercises.map((exercise: any) => ({
              workout_id: newWorkout.id,
              name: exercise.name,
              muscle_groups: exercise.muscle_groups,
              equipment_needed: exercise.equipment_needed,
              instructions: exercise.instructions,
              sets: exercise.sets,
              reps: exercise.reps,
              weight_kg: exercise.weight_kg,
              duration_seconds: exercise.duration_seconds,
              rest_seconds: exercise.rest_seconds,
              notes: exercise.notes,
              order_index: exercise.order_index,
            }))

            const { data: newExercises, error: exerciseError } = await supabase
              .from('workout_exercises')
              .insert(exercisePayloads)
              .select()

            if (exerciseError) {
              throw exerciseError
            }

            newWorkout.exercises = newExercises
          }

          // Update local state
          const { workouts } = get()
          set({ 
            workouts: [newWorkout, ...workouts],
            loading: false 
          })

          return newWorkout
        } catch (error) {
          console.error('Error duplicating workout:', error)
          set({ loading: false })
          throw error
        }
      },

      startWorkoutSession: async (workoutId: string) => {
        try {
          const { user } = useAuthStore.getState()
          if (!user) throw new Error('No user logged in')

          set({ loading: true })
          
          const sessionData = {
            user_id: user.id,
            workout_id: workoutId,
            started_at: new Date().toISOString(),
            status: 'in_progress' as const,
          }

          const { data: session, error } = await supabase
            .from('workout_sessions')
            .insert(sessionData)
            .select(`
              *,
              workout:workouts(*)
            `)
            .single()

          if (error) {
            throw error
          }

          set({ currentSession: session, loading: false })
          return session
        } catch (error) {
          console.error('Error starting workout session:', error)
          set({ loading: false })
          throw error
        }
      },

      completeWorkoutSession: async (sessionId: string, completedData: any) => {
        try {
          set({ loading: true })
          
          const updateData = {
            completed_at: new Date().toISOString(),
            duration_minutes: completedData.duration_minutes,
            calories_burned: completedData.calories_burned,
            exercises_completed: completedData.exercises_completed,
            notes: completedData.notes,
            mood_after: completedData.mood_after,
            perceived_exertion: completedData.perceived_exertion,
          }

          const { error } = await supabase
            .from('workout_sessions')
            .update(updateData)
            .eq('id', sessionId)

          if (error) {
            throw error
          }

          set({ currentSession: null, loading: false })
        } catch (error) {
          console.error('Error completing workout session:', error)
          set({ loading: false })
          throw error
        }
      },

      pauseWorkoutSession: async (sessionId: string) => {
        try {
          const { error } = await supabase
            .from('workout_sessions')
            .update({ status: 'paused' })
            .eq('id', sessionId)

          if (error) {
            throw error
          }
        } catch (error) {
          console.error('Error pausing workout session:', error)
          throw error
        }
      },

      resumeWorkoutSession: async (sessionId: string) => {
        try {
          const { error } = await supabase
            .from('workout_sessions')
            .update({ status: 'in_progress' })
            .eq('id', sessionId)

          if (error) {
            throw error
          }
        } catch (error) {
          console.error('Error resuming workout session:', error)
          throw error
        }
      },

      setCurrentWorkout: (workout: Workout | null) => set({ currentWorkout: workout }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'workout-store',
    }
  )
)