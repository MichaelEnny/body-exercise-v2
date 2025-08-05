import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function finalVerification() {
  console.log('🔍 Final FitPlatform Setup Verification...\n')

  try {
    // Direct SQL query to check what tables exist
    console.log('1️⃣ Checking database schema...')
    
    const { data: tables, error: schemaError } = await supabase
      .rpc('get_schema_info')

    if (schemaError) {
      console.log('Using alternative method to check tables...')
      
      // Try to list all tables using information_schema
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .order('table_name')

      if (error) {
        console.log(`Error checking schema: ${error.message}`)
        
        // Final fallback - try to query each table individually
        const expectedTables = [
          'users', 'trainer_profiles', 'workouts', 'workout_sessions',
          'health_metrics', 'device_syncs', 'trainer_client_relationships',
          'workout_plans', 'subscriptions'
        ]

        console.log('\n2️⃣ Testing individual table access...')
        
        for (const tableName of expectedTables) {
          try {
            const { error: tableError } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true })
              .limit(1)

            if (tableError) {
              if (tableError.message.includes('does not exist')) {
                console.log(`❌ ${tableName} - Table does not exist`)
              } else if (tableError.message.includes('permission denied')) {
                console.log(`🔒 ${tableName} - Table exists but access restricted`)
              } else {
                console.log(`⚠️ ${tableName} - ${tableError.message}`)
              }
            } else {
              console.log(`✅ ${tableName} - Table exists and accessible`)
            }
          } catch (err: any) {
            console.log(`❌ ${tableName} - Error: ${err.message}`)
          }
        }
      } else {
        console.log(`Found ${data?.length || 0} tables in public schema:`)
        data?.forEach(table => console.log(`  - ${table.table_name}`))
      }
    }

    // Test authentication functions
    console.log('\n3️⃣ Testing Supabase Auth functions...')
    
    const { data: authUser, error: authError } = await supabase.auth.getUser()
    console.log(`Auth status: ${authError ? 'No session' : 'Active session'}`)

    // Test creating a user profile manually
    console.log('\n4️⃣ Testing manual user profile creation...')
    
    const testUserId = '123e4567-e89b-12d3-a456-426614174000' // Example UUID
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: 'test@example.com',
          full_name: 'Test User',
          subscription_tier: 'free',
          is_trainer: false
        })
        .select()

      if (insertError) {
        if (insertError.message.includes('does not exist')) {
          console.log('❌ Users table does not exist - migration needed')
        } else if (insertError.message.includes('foreign key')) {
          console.log('⚠️ Users table exists but foreign key constraint failed (expected)')
        } else {
          console.log(`⚠️ Insert error: ${insertError.message}`)
        }
      } else {
        console.log('✅ Successfully inserted test user profile')
        
        // Clean up test data
        await supabase.from('users').delete().eq('id', testUserId)
      }
    } catch (err: any) {
      console.log(`❌ Profile creation test failed: ${err.message}`)
    }

    console.log('\n📊 Final Status Summary:')
    console.log(`🔗 Supabase URL: ${supabaseUrl}`)
    console.log(`🔑 Service Key: ${supabaseServiceKey ? 'Present' : 'Missing'}`)
    console.log(`🔑 Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}`)

  } catch (error: any) {
    console.error('💥 Verification failed:', error.message)
  }
}

finalVerification().then(() => {
  console.log('\n🏁 Final verification complete')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Final verification failed:', error.message)
  process.exit(1)
})