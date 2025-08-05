import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton client for use in components
export const supabase = createClient()