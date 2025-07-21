import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 })
    }

    // Redirect to onboarding after successful authentication
    return NextResponse.redirect(new URL('/onboarding', process.env.NEXT_PUBLIC_URL))
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}