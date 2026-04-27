import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') ?? 'customer' // Default to customer
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // After successful login/signup, ensure a profile exists with the correct role
      const userId = data.user.id
      const email = data.user.email
      
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (!profile) {
        // Create profile with the role passed in the URL
        await supabase.from('profiles').insert({
          id: userId,
          full_name: data.user.user_metadata.full_name || email,
          role: role as 'customer' | 'driver' | 'admin',
          avatar_url: data.user.user_metadata.avatar_url
        })
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
