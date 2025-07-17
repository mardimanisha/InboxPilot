import { createLogger } from '../utils/logger'
import { GmailService, GmailServiceConfig, GmailScanRequest, GmailScanResponse, GmailEmail, EmailClassification } from '../types/gmail'
import { User } from '../types/auth'
import { supabase } from '../lib/supabase'
import { GmailApiClient } from './gmailClient'

const logger = createLogger('GmailService')

export class GmailServiceImpl implements GmailService {
  private config: GmailServiceConfig
  private readonly MAX_EMAILS_PER_REQUEST = 100
  private gmailClient?: GmailApiClient

  private constructor() {
    this.config = {
      apiKey: process.env.GMAIL_API_KEY || '',
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || ''
    };
    this.gmailClient = undefined; // Initialize to undefined
  }

  static async create(): Promise<GmailServiceImpl> {
    const service = new GmailServiceImpl();
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data?.session?.user) {
      throw new Error('User not authenticated');
    }
    service.gmailClient = new GmailApiClient(data.session.user);
    return service;
  }

  async initialize(config: GmailServiceConfig): Promise<void> {
    this.config = config
    logger.info('Gmail service initialized', { config: { ...config, clientSecret: '***' } })
  }

  async scanInbox(request: GmailScanRequest): Promise<GmailScanResponse> {
    try {
      logger.info('Starting inbox scan', { userId: request.userId })
      
      // Fetch user's Gmail access token from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        throw new Error('User not authenticated')
      }

      // Initialize Gmail client with user from session
      this.gmailClient = new GmailApiClient(session.user)
      
      // Fetch emails using Gmail API
      const emails = await this.gmailClient.fetchEmails(request.maxResults, request.pageToken)
      
      // Classify emails
      const classifications = await this.classifyEmails(emails)
      
      // Store emails and classifications in Supabase
      await this.storeEmailsAndClassifications(request.userId, emails, classifications)

      return {
        emails,
        classifications,
        totalScanned: emails.length
      }
    } catch (error) {
      logger.error('Error scanning inbox', { error })
      throw error
    }
  }

  async classifyEmails(emails: GmailEmail[]): Promise<EmailClassification[]> {
    return emails.map(email => {
      // Basic classification logic based on email properties
      const classification: EmailClassification = {
        id: email.id,
        category: 'fyi',
        confidence: 0.8,
        reason: 'Default classification'
      }

      // Check for urgent indicators in subject
      const urgentKeywords = ['urgent', 'immediate', 'asap', 'priority']
      if (urgentKeywords.some(keyword => email.subject.toLowerCase().includes(keyword))) {
        classification.category = 'urgent'
        classification.confidence = 0.95
        classification.reason = 'Contains urgent keywords in subject'
      }

      // Check for action items
      if (email.body.toLowerCase().includes('please')) {
        classification.category = 'action_needed'
        classification.confidence = 0.85
        classification.reason = 'Contains action request'
      }

      return classification
    })
  }

  async storeEmailsAndClassifications(
    userId: string,
    emails: GmailEmail[],
    classifications: EmailClassification[]
  ): Promise<void> {
    try {
      logger.info('Storing emails and classifications', { userId })
      
      // Store emails in Supabase
      const emailInserts = emails.map(email => ({
        user_id: userId,
        email_id: email.id,
        thread_id: email.threadId,
        from: email.from,
        to: email.to,
        subject: email.subject,
        body: email.body,
        date: email.date,
        labels: email.labels,
        importance: email.importance
      }))

      const { error: emailError } = await supabase
        .from('emails')
        .upsert(emailInserts)
        .select()

      if (emailError) {
        throw emailError
      }

      // Store classifications
      const classificationInserts = classifications.map(classification => ({
        user_id: userId,
        email_id: classification.id,
        category: classification.category,
        confidence: classification.confidence,
        reason: classification.reason
      }))

      const { error: classificationError } = await supabase
        .from('email_classifications')
        .upsert(classificationInserts)
        .select()

      if (classificationError) {
        throw classificationError
      }
    } catch (error) {
      logger.error('Error storing emails and classifications', { error })
      throw error
    }
  }
}
