import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createLogger } from '../../../../utils/logger'
import { ProgressService } from '../../../../services/progress.service'


const logger = createLogger('ProgressAPI')

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const supabase = createRouteHandlerClient({ cookies })

    // Verify the user is authenticated and matches the requested userId
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (session.user.id !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the latest progress for the user
    const progress = await ProgressService.getProgress(userId)

    if (!progress) {
      return new NextResponse(
        JSON.stringify({ error: 'No progress found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new NextResponse(
      JSON.stringify(progress),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    logger.error('Error fetching progress:', { error })
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
