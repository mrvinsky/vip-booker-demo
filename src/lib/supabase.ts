import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // During build time (prerendering), if env vars are missing, 
    // we return a dummy client to prevent crashing.
    console.warn('Supabase credentials missing. Returning dummy client.')
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
