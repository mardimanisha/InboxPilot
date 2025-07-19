
import { NextResponse } from 'next/server'
import { GmailServiceImpl } from '../../services/gmail'
import { supabase } from '../../lib/supabaseClient'


interface ScanInboxRequest {
  userId: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json() as ScanInboxRequest
    
    // Get user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Initialize Gmail service
    const gmailService = await GmailServiceImpl.create()
    
    // Scan inbox
    const scanRequest = {
      userId: userId,
      maxResults: 100 // As per onboarding steps
    }

    const scanResult = await gmailService.scanInbox(scanRequest)

    return NextResponse.json({
      success: true,
      data: scanResult
    })
  } catch (error) {
    console.error('Error scanning inbox:', error)
    return NextResponse.json(
      { error: 'Failed to scan inbox' },
      { status: 500 }
    )
  }
}
