import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { RedisService } from '../../../../backend/src/services/redis'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: import('@supabase/ssr').CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: import('@supabase/ssr').CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          }
        },
      }
    )
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch processed emails from Redis
    const redisService = RedisService.getInstance()
    const processedEmails = await redisService.getProcessedEmails(session.user.id)
    
    // Sort emails by processedAt timestamp (newest first)
    const sortedEmails = processedEmails.sort((a, b) => 
      new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
    )

    return NextResponse.json({ emails: sortedEmails })
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}
