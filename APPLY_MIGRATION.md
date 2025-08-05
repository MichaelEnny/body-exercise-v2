# 🚀 Apply FitPlatform Database Migration

## ⚠️ IMPORTANT: Database Tables Need to be Created

The verification shows that **the database tables do not exist yet** in your Supabase project. You need to apply the migration to create all the required tables.

## 📋 Quick Steps to Apply Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/projects
   - Select your project: `mpviattxcnjfnpyyakyw`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run Migration**
   - Open: `database/migrations/001_initial_schema.sql`
   - Copy the ENTIRE contents of the file
   - Paste into the SQL Editor
   - Click "Run" button

4. **Verify Success**
   - You should see "Success. No rows returned" message
   - Check "Table Editor" to confirm all 9 tables are created

### Option 2: Automated Script

I've created an automated migration script. Run this command:

```bash
cd "C:\Users\wisdo\OneDrive\Desktop\BusinessIncorporation\body-exercise-v2"
npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/apply-migration.ts
```

## 📊 Expected Tables to be Created

After running the migration, you should have these 9 tables:

1. ✅ **users** - User profiles and subscription info
2. ✅ **trainer_profiles** - Trainer-specific information  
3. ✅ **workouts** - Workout plans and templates
4. ✅ **workout_sessions** - Individual workout completions
5. ✅ **health_metrics** - Daily health and fitness metrics
6. ✅ **device_syncs** - Third-party app connections
7. ✅ **trainer_client_relationships** - Trainer-client connections
8. ✅ **workout_plans** - Structured workout programs
9. ✅ **subscriptions** - Payment and billing information

## 🔐 Security Features Included

- **Row Level Security (RLS)** enabled on all tables
- **Multi-tenant data isolation** between users
- **Trainer-client relationship** access controls
- **Automatic user profile creation** via triggers
- **Data integrity constraints** and validation

## 🧪 After Migration - Test the System

Once the migration is applied, run the verification:

```bash
# Test database tables exist
npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/verify-database.ts

# Test authentication system
npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/test-auth.ts
```

## 🔧 Troubleshooting

### If Migration Fails:
1. Check you're using the correct Supabase project
2. Ensure you have admin/owner permissions
3. Try running smaller chunks of the SQL file
4. Check Supabase logs for detailed error messages

### If Tables Don't Appear:
1. Refresh the Supabase dashboard
2. Check the "public" schema in Table Editor
3. Verify the SQL ran without errors
4. Check for typos in table names

## 📞 Manual Migration (If Needed)

If the automated migration fails, you can create tables manually:

1. **Users Table**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  is_trainer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

2. **Enable RLS**:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
```

3. **Continue with remaining tables** from the full migration file...

---

## ✅ Ready to Proceed

Once the migration is applied successfully:

1. All authentication flows will work properly
2. User registration will create profiles automatically  
3. The dashboard will display user-specific data
4. RLS policies will protect user data
5. You can begin developing features like workout creation

**The FitPlatform foundation will be 100% complete and ready for feature development!**