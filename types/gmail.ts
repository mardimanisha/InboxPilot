export type EmailCategory = 'urgent' | 'actionNeeded' | 'fyi' | 'ignore'

export interface GmailEmail {
  id: string
  subject: string
  sender: string
  content: string
  timestamp: string
  threadId: string
}

export interface EmailClassification {
  category: EmailCategory
  confidence: number
  reason: string
}

export interface GmailScanRequest {
  userId: string
  maxResults?: number
}

export interface GmailScanResponse {
  emails: GmailEmail[]
  totalResults: number
  nextPageToken?: string
}

export interface RedisQueueJob {
  userId: string
  emails: GmailEmail[]
  classifications: EmailClassification[]
  timestamp: string
}

export interface ProcessedEmail {
  id: string
  userId: string
  subject: string
  content: string
  classification: EmailClassification
  processedAt: string
  sender: string
  time: string
  preview: string
  unread: boolean
  category: EmailCategory
}
