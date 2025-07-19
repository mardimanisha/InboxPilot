export interface ProcessedEmail {
  id: string;
  gmailId: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  category: string;
  confidence: number;
  reason: string;
  processedAt: string;
  userId: string;
}

export interface EmailClassification {
  emailId: string;
  userId: string;
  category: string;
  confidence: number;
  reason: string;
  processedAt: string;
}

export interface GmailEmail {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  labels: string[];
  importance: string;
}
