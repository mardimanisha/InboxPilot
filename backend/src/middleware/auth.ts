import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '../lib/supabase'

export async function authMiddleware(request: NextRequest) {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }

    if (!data?.session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}