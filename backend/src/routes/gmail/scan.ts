import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '../../utils/logger'
import { supabase } from '../../lib/supabase'
import { GmailServiceImpl } from '../../services/gmail'


const logger = createLogger('GmailScanRoute')

export async function POST(request: NextRequest) {
  try {
    logger.info('Received inbox scan request')
    
    // Get user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const scanRequest = {
      userId: session.user.id,
      maxResults: body.maxResults || 100,
      pageToken: body.pageToken,
      includeSpamTrash: body.includeSpamTrash
    }

    // Initialize Gmail service
    const gmailService = await GmailServiceImpl.create()

    // Perform inbox scan
    const result = await gmailService.scanInbox(scanRequest)

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error in inbox scan', { error })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
