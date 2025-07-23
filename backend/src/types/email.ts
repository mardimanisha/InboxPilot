export interface Email {
  id: string;
  userId: string;
  gmailMessageId: string;
  threadId: string;
  subject: string;
  fromAddress: string;
  toAddress: string;
  ccAddress?: string;
  bccAddress?: string;
  date: Date;
  snippet: string;
  body: string;
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  isSpam: boolean;
  isTrash: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAttachment {
  id: string;
  emailId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  attachmentId: string;
  createdAt: Date;
}

export interface EmailClassification {
  id: string;
  emailId: string;
  userId: string;
  classificationType: string;
  classificationScore: number;
  classificationData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailClassificationResult {
  emailId: string;
  classificationType: string;
  score: number;
  data: Record<string, any>;
}
