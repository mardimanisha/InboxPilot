import { User } from './auth'

export interface GmailEmail {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  body: string
  date: string
  labels: string[]
  importance: 'high' | 'normal' | 'low'
}

export interface EmailClassification {
  id: string
  category: 'urgent' | 'actionNeeded' | 'fyi' | 'ignore'
  confidence: number
  reason: string
}

export interface GmailServiceConfig {
  apiKey: string
  clientId: string
  clientSecret: string
}

export interface GmailScanResponse {
  emails: GmailEmail[]
  classifications: EmailClassification[]
  totalScanned: number
  errors?: string[]
}

export interface GmailScanRequest {
  userId: string
  maxResults?: number
  pageToken?: string
  includeSpamTrash?: boolean
}

export interface GmailService {
  initialize(config: GmailServiceConfig): Promise<void>
  scanInbox(request: GmailScanRequest): Promise<GmailScanResponse>
  classifyEmails(emails: GmailEmail[]): Promise<EmailClassification[]>
  storeEmailsAndClassifications(
    userId: string,
    emails: GmailEmail[],
    classifications: EmailClassification[]
  ): Promise<void>
}
