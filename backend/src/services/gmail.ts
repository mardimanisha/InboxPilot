import { createLogger } from '../utils/logger'
import { GmailService, GmailServiceConfig, GmailScanRequest, GmailScanResponse, GmailEmail, EmailClassification } from '../types/gmail'
import { User } from '../types/auth'
import { supabase } from '../lib/supabase'
import { GmailApiClient } from './gmailClient'
import { RedisQueueJob } from './redis'
import { OpenAIService } from './openai'
import { RedisService } from './redis'

const logger = createLogger('GmailService')

export class GmailServiceImpl implements GmailService {
  private config: GmailServiceConfig
  private readonly MAX_EMAILS_PER_REQUEST = 100

  private constructor(private gmailClient: GmailApiClient | undefined = undefined) {
    this.config = {
      apiKey: process.env.GMAIL_API_KEY || '',
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || ''
    };
  }

  public getConfig(): GmailServiceConfig {
    return { ...this.config };
  }

  static async create(): Promise<GmailServiceImpl> {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data?.session?.user) {
      throw new Error('User not authenticated');
    }
    return new GmailServiceImpl(new GmailApiClient(data.session.user));
  }

  static createForTest(client: GmailApiClient): GmailServiceImpl {
    return new GmailServiceImpl(client);
  }

  async initialize(config: GmailServiceConfig): Promise<void> {
    this.config = config
    logger.info('Gmail service initialized', { config: { ...config, clientSecret: '***' } })
  }

  async scanInbox(request: GmailScanRequest): Promise<GmailScanResponse> {
    try {
      logger.info('Starting inbox scan', { userId: request.userId })
      
      // Initialize Gmail client
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        throw new Error('User not authenticated')
      }
      const client = this.gmailClient || new GmailApiClient(session.user)
      
      // Fetch emails from Gmail API
      const emails = await client.fetchEmails(
        request.maxResults || this.MAX_EMAILS_PER_REQUEST,
        request.pageToken
      )

      // Classify emails
      const classifications = await this.classifyEmails(emails)

      // Store emails and classifications
      await this.storeEmailsAndClassifications(request.userId, emails, classifications)

      // Add to Redis queue for background processing
      await this.addToProcessingQueue(request.userId, emails, classifications)

      return {
        emails,
        classifications,
        totalScanned: emails.length
      }
    } catch (error) {
      logger.error('Error scanning inbox', { error, userId: request.userId })
      throw error
    }
  }

  async classifyEmails(emails: GmailEmail[]): Promise<EmailClassification[]> {
    try {
      const openaiService = OpenAIService.getInstance();
      const emailContents = emails.map(email => email.body);
      
      // Classify emails in batches of 5 to avoid API rate limits
      const batchSize = 5;
      const classifications: EmailClassification[] = [];
      
      for (let i = 0; i < emailContents.length; i += batchSize) {
        const batch = emailContents.slice(i, i + batchSize);
        const batchClassifications = await openaiService.batchClassifyEmails(batch);
        classifications.push(...batchClassifications);
      }

      // Map classifications back to original email IDs
      return emails.map(email => {
        const classification = classifications.find(c => c.id === email.id);
        return {
          id: email.id,
          category: classification?.category || 'normal',
          confidence: classification?.confidence || 0.8,
          reason: classification?.reason || 'Initial classification'
        } as EmailClassification;
      });
    } catch (error) {
      logger.error('Error classifying emails', { error });
      throw error;
    }
  }

  async storeEmailsAndClassifications(
    userId: string,
    emails: GmailEmail[],
    classifications: EmailClassification[]
  ): Promise<void> {
    try {
      const emailInserts = emails.map((email, index) => ({
        user_id: userId,
        gmail_id: email.id,
        thread_id: email.threadId,
        from: email.from,
        to: email.to,
        subject: email.subject,
        body: email.body,
        date: email.date,
        labels: email.labels,
        importance: email.importance,
        classification: classifications[index].category,
        confidence: classifications[index].confidence,
        classification_reason: classifications[index].reason,
        created_at: new Date().toISOString()
      }))

      // Store emails
      const { error: emailError } = await supabase
        .from('emails')
        .upsert(emailInserts)
        .select()

      if (emailError) {
        throw emailError
      }

      logger.info('Successfully stored emails and classifications', { userId, emailCount: emails.length })
    } catch (error) {
      logger.error('Error storing emails and classifications', { error })
      throw error
    }
  }

  async addToProcessingQueue(
    userId: string,
    emails: GmailEmail[],
    classifications: EmailClassification[]
  ): Promise<void> {
    try {
      // Create Redis job
      const job: RedisQueueJob = {
        userId,
        emails,
        classifications,
        timestamp: new Date().toISOString()
      }

      // Add to Redis queue using RedisService
      await RedisService.getInstance().addToQueue(job)
    } catch (error) {
      logger.error('Error adding to processing queue', { error, userId })
      throw error
    }
  }
}
