import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // Create sample exercise data
    const sampleExercises = [
      {
        id: 'ex-1',
        name: 'Push-ups',
        muscle_groups: ['chest', 'shoulders', 'triceps'],
        equipment_needed: ['bodyweight'],
        instructions: [
          'Start in plank position with hands shoulder-width apart',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Keep your core tight throughout the movement'
        ],
        sets: [
          { set_number: 1, reps: 10, rest_seconds: 60 },
          { set_number: 2, reps: 10, rest_seconds: 60 },
          { set_number: 3, reps: 10, rest_seconds: 0 }
        ]
      },
      {
        id: 'ex-2',
        name: 'Squats',
        muscle_groups: ['quadriceps', 'glutes', 'hamstrings'],
        equipment_needed: ['bodyweight'],
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body as if sitting back into a chair',
          'Keep your chest up and knees over toes',
          'Return to starting position'
        ],
        sets: [
          { set_number: 1, reps: 15, rest_seconds: 60 },
          { set_number: 2, reps: 15, rest_seconds: 60 },
          { set_number: 3, reps: 15, rest_seconds: 0 }
        ]
      },
      {
        id: 'ex-3',
        name: 'Plank',
        muscle_groups: ['core', 'shoulders'],
        equipment_needed: ['bodyweight'],
        instructions: [
          'Start in push-up position but rest on your forearms',
          'Keep your body in a straight line from head to heels',
          'Hold the position while breathing normally',
          'Keep your core engaged'
        ],
        sets: [
          { set_number: 1, duration_seconds: 30, rest_seconds: 60 },
          { set_number: 2, duration_seconds: 30, rest_seconds: 60 },
          { set_number: 3, duration_seconds: 30, rest_seconds: 0 }
        ]
      }
    ]

    // Create sample workout templates
    const sampleWorkouts = [
      {
        id: 'workout-1',
        user_id: 'system', // Will be replaced with actual user IDs
        name: 'Beginner Full Body',
        description: 'A complete full body workout perfect for beginners. No equipment required!',
        exercises: sampleExercises,
        duration_minutes: 30,
        difficulty_level: 'beginner',
        workout_type: 'strength',
        tags: ['bodyweight', 'full-body', 'beginner-friendly'],
        is_template: true,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'workout-2',
        user_id: 'system',
        name: 'Quick Morning Routine',
        description: 'Start your day with this energizing 15-minute routine',
        exercises: [sampleExercises[0], sampleExercises[2]], // Push-ups and Plank
        duration_minutes: 15,
        difficulty_level: 'beginner',
        workout_type: 'mixed',
        tags: ['morning', 'quick', 'energizing'],
        is_template: true,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    console.log('📝 Creating sample workout templates...')
    
    // Note: In a real implementation, you would create these in the database
    // For now, we'll just log what would be created
    console.log('Sample workouts that would be created:')
    sampleWorkouts.forEach(workout => {
      console.log(`- ${workout.name} (${workout.difficulty_level} ${workout.workout_type})`)
    })

    console.log('\n✅ Database seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- ${sampleExercises.length} exercise templates`)
    console.log(`- ${sampleWorkouts.length} workout templates`)
    console.log('\nNote: This is a mock seed script. In production, you would:')
    console.log('1. Set up Supabase database tables using migrations')
    console.log('2. Actually insert the sample data')
    console.log('3. Create proper user accounts and associate data')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()