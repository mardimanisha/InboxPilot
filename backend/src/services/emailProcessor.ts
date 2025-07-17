import { GmailServiceImpl } from './gmail'
import { GmailService, GmailScanRequest } from '../types/gmail'
import { OpenAIService } from './openai'
import { RedisService, RedisQueueJob } from './redis'
import { GmailEmail, EmailClassification } from '../types/gmail'
import { createLogger } from '../utils/logger'

const logger = createLogger('EmailProcessorService')

export interface EmailProcessingResult {
  processedEmails: GmailEmail[]
  classifications: EmailClassification[]
}

export class EmailProcessorService {
  private static instance: EmailProcessorService
  private gmailService: Promise<GmailServiceImpl>
  private openaiService: OpenAIService
  private redisService: RedisService

  private constructor() {
    this.gmailService = GmailServiceImpl.create()
    this.openaiService = OpenAIService.getInstance()
    this.redisService = RedisService.getInstance()
  }

  public static getInstance(): EmailProcessorService {
    if (!EmailProcessorService.instance) {
      EmailProcessorService.instance = new EmailProcessorService()
    }
    return EmailProcessorService.instance
  }

  async processEmails(userId: string): Promise<EmailProcessingResult> {
    try {
      logger.info('Starting email processing for user', { userId })
      
      // Step 1: Scan Gmail inbox
      const scanRequest: GmailScanRequest = {
        userId,
        maxResults: 100
      }
      const gmailService = await this.gmailService
      const scanResponse = await gmailService.scanInbox(scanRequest)
      
      if (!scanResponse.emails || scanResponse.emails.length === 0) {
        logger.info('No emails found for user', { userId })
        return { processedEmails: [], classifications: [] }
      }

      // Step 2: Classify emails using OpenAI
      const classifications = await Promise.all(
        scanResponse.emails.map(async (email) => {
          const classification = await this.openaiService.classifyEmail(email.body)
          return {
            ...classification,
            emailId: email.id
          }
        })
      )

      // Step 3: Store in Redis queue for further processing
      const queueJob: RedisQueueJob = {
        userId,
        emails: scanResponse.emails,
        classifications,
        timestamp: new Date().toISOString()
      }

      await this.redisService.addToQueue(queueJob)

      logger.info('Email processing completed successfully', { userId })
      return { processedEmails: scanResponse.emails, classifications }
    } catch (error) {
      logger.error('Error processing emails', { userId, error })
      throw error
    }
  }
}
