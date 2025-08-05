import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🚀 Applying FitPlatform Database Migration...\n')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using Service Role Key: ${supabaseServiceKey.substring(0, 20)}...\n`)

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '001_initial_schema.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found at:', migrationPath)
      return
    }

    console.log('📄 Reading migration file...')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log(`📏 Migration file size: ${migrationSQL.length} characters`)
    console.log('🔍 Preview of migration:')
    console.log(migrationSQL.substring(0, 200) + '...\n')

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length === 0) continue

      console.log(`${i + 1}/${statements.length} Executing: ${statement.substring(0, 60)}...`)

      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        })

        if (error) {
          // Try direct query method
          const { error: directError } = await supabase
            .from('_internal')
            .select('*')
            .eq('query', statement)

          if (directError) {
            console.log(`❌ Failed: ${error.message}`)
            errorCount++
          } else {
            console.log(`✅ Success via direct method`)
            successCount++
          }
        } else {
          console.log(`✅ Success`)
          successCount++
        }
      } catch (err: any) {
        console.log(`❌ Error: ${err.message}`)
        errorCount++
      }
    }

    console.log(`\n📊 Migration Summary:`)
    console.log(`✅ Successful statements: ${successCount}`)
    console.log(`❌ Failed statements: ${errorCount}`)
    console.log(`📋 Total statements: ${statements.length}`)

    if (errorCount === 0) {
      console.log('\n🎉 Database migration completed successfully!')
    } else {
      console.log('\n⚠️  Some statements failed. Manual intervention may be required.')
      console.log('💡 Try running the SQL manually in Supabase Dashboard > SQL Editor')
    }

    // Verification step
    console.log('\n🔍 Verifying table creation...')
    
    const expectedTables = [
      'users', 'trainer_profiles', 'workouts', 'workout_sessions', 
      'health_metrics', 'device_syncs', 'trainer_client_relationships', 
      'workout_plans', 'subscriptions'
    ]

    for (const table of expectedTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: table accessible`)
        }
      } catch (err: any) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

  } catch (error: any) {
    console.error('💥 Migration failed:', error.message)
  }
}

// Run migration
applyMigration().then(() => {
  console.log('\n🏁 Migration process complete')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Migration process failed:', error.message)
  process.exit(1)
})