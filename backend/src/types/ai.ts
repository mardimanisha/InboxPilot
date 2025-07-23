export type PriorityLevel = 'high' | 'medium' | 'low';
export type EmailCategory = 'URGENT' | 'ACTION_REQUIRED' | 'FOLLOW_UP' | 'REFERENCE' | 'PROMOTIONAL' | 'SOCIAL' | 'SPAM';

export interface EmailClassificationRequest {
  emailId: string;
  subject: string;
  body: string;
  sender: string;
  recipients: string[];
  date: Date;
  labels?: string[];
}

export interface EmailClassificationResponse {
  emailId: string;
  classificationType: 'priority';
  score: number;
  priority: PriorityLevel;
  category: EmailCategory;
  reasoning: string;
  suggestedActions: string[];
}

export interface EmailClassification {
  id: string;
  emailId: string;
  userId: string;
  classificationType: 'priority';
  classificationScore: number;
  classificationData: {
    priority: PriorityLevel;
    category: EmailCategory;
    reasoning: string;
    suggestedActions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassificationResult extends Omit<EmailClassification, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  emailId: string;
  priority: PriorityLevel;
  category: EmailCategory;
  score: number;
  reasoning: string;
  suggestedActions: string[];
  classificationData: {
    priority: PriorityLevel;
    category: EmailCategory;
    reasoning: string;
    suggestedActions: string[];
  };
}
