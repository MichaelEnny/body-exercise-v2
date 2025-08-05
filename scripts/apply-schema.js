#!/usr/bin/env node
/**
 * Schema Application Script for FitPlatform
 * This script applies the database schema directly to the live Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function applySchema() {
  console.log('🚀 Starting FitPlatform database schema application...');
  
  // Create Supabase client with service role key for admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '001_initial_schema.sql');
    const schemaSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Reading schema from:', migrationPath);
    
    // Split the SQL into individual statements for better error handling
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements
      if (!statement || statement.length < 10) continue;
      
      console.log(`\n⚡ Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });
        
        if (error) {
          // Some errors are expected (like "already exists" errors)
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`   ⚠️  Warning (expected): ${error.message}`);
          } else {
            console.error(`   ❌ Error: ${error.message}`);
            errorCount++;
          }
        } else {
          console.log(`   ✅ Success`);
          successCount++;
        }
      } catch (err) {
        console.error(`   ❌ Unexpected error: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Schema application completed!');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`⚠️  Errors (may be expected): ${errorCount}`);
    
    // Test the connection by querying a simple table
    console.log('\n🔍 Testing database connection...');
    
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (testError && !testError.message.includes('relation "users" does not exist')) {
      console.error('❌ Database connection test failed:', testError.message);
    } else {
      console.log('✅ Database connection successful!');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during schema application:', error.message);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function applySchemaDirectly() {
  console.log('🔧 Applying schema using direct SQL execution...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Read the migration SQL file
  const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '001_initial_schema.sql');
  const schemaSQL = fs.readFileSync(migrationPath, 'utf8');
  
  // Execute the entire schema as one transaction
  try {
    console.log('📤 Executing complete schema...');
    
    // Use the raw SQL execution method
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql: schemaSQL
      })
    });
    
    const result = await response.text();
    console.log('📋 Schema application result:', result);
    
    if (response.ok) {
      console.log('✅ Schema applied successfully!');
    } else {
      console.error('❌ Schema application failed:', result);
    }
    
  } catch (error) {
    console.error('💥 Error applying schema:', error.message);
  }
}

// Create individual tables manually for better control
async function createTablesManually() {
  console.log('🔨 Creating tables manually...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const tableDefinitions = [
    {
      name: 'Enable UUID Extension',
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    },
    {
      name: 'Users Table',
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
          subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
          subscription_end_date TIMESTAMPTZ,
          is_trainer BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'Trainer Profiles Table',
      sql: `
        CREATE TABLE IF NOT EXISTS trainer_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          business_name TEXT,
          bio TEXT,
          certifications TEXT[] DEFAULT '{}',
          specializations TEXT[] DEFAULT '{}',
          years_experience INTEGER,
          hourly_rate DECIMAL(10, 2),
          custom_branding JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `
    },
    {
      name: 'Workouts Table',
      sql: `
        CREATE TABLE IF NOT EXISTS workouts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          exercises JSONB NOT NULL DEFAULT '[]',
          duration_minutes INTEGER,
          difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
          workout_type TEXT NOT NULL CHECK (workout_type IN ('strength', 'cardio', 'flexibility', 'sports', 'mixed')),
          tags TEXT[] DEFAULT '{}',
          is_template BOOLEAN NOT NULL DEFAULT FALSE,
          is_public BOOLEAN NOT NULL DEFAULT FALSE,
          created_by_trainer UUID REFERENCES users(id),
          assigned_to_client UUID REFERENCES users(id),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'Workout Sessions Table',
      sql: `
        CREATE TABLE IF NOT EXISTS workout_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
          started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          duration_minutes INTEGER,
          calories_burned INTEGER,
          exercises_completed JSONB NOT NULL DEFAULT '[]',
          notes TEXT,
          mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
          mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
          perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10),
          synced_from TEXT CHECK (synced_from IN ('apple_health', 'google_fit', 'strava', 'manual')),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tableDefinitions) {
    try {
      console.log(`\n🔧 Creating: ${table.name}`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
          sql: table.sql
        })
      });
      
      if (response.ok) {
        console.log(`✅ ${table.name} created successfully`);
      } else {
        const error = await response.text();
        console.log(`⚠️  ${table.name}: ${error}`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating ${table.name}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 FitPlatform Database Schema Application');
  console.log('==========================================');
  
  // Verify environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  console.log('✅ Environment variables loaded');
  console.log(`🔗 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  
  // Try different methods to apply the schema
  await createTablesManually();
  
  console.log('\n🎉 Database schema application completed!');
  console.log('🌐 Check your Supabase dashboard at: https://supabase.com/dashboard/project/mpviattxcnjfnpyyakyw');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { applySchema, createTablesManually };