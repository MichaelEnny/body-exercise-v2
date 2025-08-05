import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyDatabase() {
  console.log('🔍 Verifying FitPlatform Database Structure...\n')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using Service Role Key: ${supabaseServiceKey.substring(0, 20)}...\n`)

  try {
    // Check if we can connect to Supabase by running a simple query
    console.log('1️⃣ Testing database connection...')
    const { data: connectionTest, error: connectionError } = await supabase.rpc('get_tables')

    // If RPC fails, try a direct table query approach
    console.log('2️⃣ Checking existing tables...')
    
    // Try to query each expected table to see if it exists
    const expectedTables = [
      'users',
      'trainer_profiles', 
      'workouts',
      'workout_sessions',
      'health_metrics',
      'device_syncs',
      'trainer_client_relationships',
      'workout_plans',
      'subscriptions'
    ]

    const existingTables: string[] = []
    const missingTables: string[] = []

    for (const table of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table} - ${error.message}`)
          missingTables.push(table)
        } else {
          console.log(`✅ ${table} - accessible`)
          existingTables.push(table)
        }
      } catch (err: any) {
        console.log(`❌ ${table} - Error: ${err.message}`)
        missingTables.push(table)
      }
    }

    console.log('\n3️⃣ Verification summary...')

    console.log(`\n📊 Summary:`)
    console.log(`✅ Present tables: ${existingTables.length}/${expectedTables.length}`)
    console.log(`❌ Missing tables: ${missingTables.length}/${expectedTables.length}`)

    if (missingTables.length > 0) {
      console.log('\n⚠️  Database migration needed!')
      console.log('📄 Run the migration from: database/migrations/001_initial_schema.sql')
      console.log('🔧 Instructions: See AUTH_SETUP_GUIDE.md')
    } else {
      console.log('\n🎉 All required tables are present!')
      
      // Test a simple query on users table
      console.log('\n4️⃣ Testing users table access...')
      try {
        const { count, error: userError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        if (userError) {
          console.log(`❌ Users table access error: ${userError.message}`)
        } else {
          console.log(`✅ Users table accessible (${count || 0} users)`)
        }
      } catch (err: any) {
        console.log(`❌ Users table test failed: ${err.message}`)
      }
    }

  } catch (error: any) {
    console.error('💥 Unexpected error:', error.message)
  }
}

// Run verification
verifyDatabase().then(() => {
  console.log('\n🏁 Database verification complete')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Verification failed:', error.message)
  process.exit(1)
})