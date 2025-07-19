import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '../../utils/logger'
import { EmailProcessorService } from '../../services/emailProcessor'


const logger = createLogger('EmailProcessingAPI')

interface ProcessEmailsRequest {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json() as ProcessEmailsRequest
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    logger.info('Starting email processing', { userId })
    
    const emailProcessor = EmailProcessorService.getInstance()
    const result = await emailProcessor.processEmails(userId)
    
    logger.info('Email processing completed', { userId, processedCount: result.processedEmails.length })
    
    return NextResponse.json({
      success: true,
      processedEmails: result.processedEmails.length,
      message: 'Email processing initiated successfully'
    })
  } catch (error) {
    logger.error('Error processing emails', { error })
    return NextResponse.json(
      { error: 'Failed to process emails' },
      { status: 500 }
    )
  }
}
