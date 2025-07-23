import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 500 })
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 })
  }
}
