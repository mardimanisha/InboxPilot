import { AIService } from '../backend/src/services/ai.service';
import { Email } from '../backend/src/types/email';
import { EmailService } from '../backend/src/services/email.service';

// Create mock functions that can be used in jest.mock
const createMockFunction = () => {
  const fn = jest.fn();
  fn.mockReturnThis();
  return fn;
};

// Mock the supabase module with direct implementation
jest.mock('../backend/src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
  },
}));

// Import the mocked supabase after mocking
import { supabase } from '../backend/src/lib/supabase';
// Type the mock properly to include all query builder methods
const mockSupabaseInstance = supabase as any;

// Mock the OpenAI client
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockRejectedValue(new Error('OpenAI API error')), // Force fallback to basicClassifyEmail
      },
    },
  })),
}));

// Mock EmailService
jest.mock('../backend/src/services/email.service');

const mockEmail: Email = {
  id: 'email1',
  userId: 'user123',
  gmailMessageId: 'msg1',
  threadId: 'thread1',
  subject: 'Weekly Report Update',
  fromAddress: 'reports@example.com',
  toAddress: 'user@example.com',
  ccAddress: '',
  bccAddress: '',
  date: new Date(),
  snippet: 'This week in tech news...',
  body: 'Here are the latest updates and news from our platform. This is for your information.',
  labels: ['INBOX'],
  isRead: false,
  isStarred: false,
  isDraft: false,
  isSpam: false,
  isTrash: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock EmailService.getUserEmails
    (EmailService.getUserEmails as jest.Mock).mockResolvedValue([mockEmail]);
    // Reset all mock implementations before each test
    mockSupabaseInstance.from.mockClear().mockReturnThis();
    mockSupabaseInstance.insert.mockClear().mockReturnThis();
    mockSupabaseInstance.eq.mockClear().mockReturnThis();
    mockSupabaseInstance.select.mockClear().mockResolvedValue({ data: [], error: null });
  });

  describe('classifyEmail', () => {
    it('should classify an email', async () => {
      const result = await AIService.classifyEmail(mockEmail);
      
      expect(result).toBeDefined();
      expect(result.category).toBe('REFERENCE'); // basicClassifyEmail fallback
      expect(result.priority).toBe('low');
      expect(result.score).toBe(0.7); // Basic classification confidence
      expect(result.suggestedActions).toContain('Archive when read');
    });
  });

  describe('classifyUserEmails', () => {
    it('should classify multiple emails and save classifications', async () => {
      // Mock successful save
      mockSupabaseInstance.insert.mockReturnValue({
        select: jest.fn().mockReturnValue({
          data: [{
            id: 'classification1',
            emailId: 'email1',
            userId: 'user123',
            classificationType: 'priority',
            classificationScore: 0.85,
            classificationData: {
              priority: 'medium',
              category: 'PROMOTIONAL',
              reasoning: 'Email appears to be a marketing message',
              suggestedActions: ['Archive', 'Mark as read']
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          error: null
        })
      });
      
      const results = await AIService.classifyUserEmails('user123', {
        emailIds: ['email1']
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].emailId).toBe('email1');
      expect(EmailService.getUserEmails).toHaveBeenCalledWith('user123', {
        limit: 20
      });
      
      // Verify Supabase insert was called
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('email_classifications');
      expect(mockSupabaseInstance.insert).toHaveBeenCalledTimes(1);
    });

    it('should handle empty email list', async () => {
      (EmailService.getUserEmails as jest.Mock).mockResolvedValueOnce([]);
      
      const results = await AIService.classifyUserEmails('user123');
      
      expect(results).toHaveLength(0);
    });
  });

  describe('saveClassifications', () => {
    it('should save classifications to the database', async () => {
      const mockClassification = {
        emailId: 'email1',
        userId: 'user123',
        classificationType: 'priority',
        classificationScore: 0.85,
        classificationData: {
          priority: 'medium',
          category: 'PROMOTIONAL',
          reasoning: 'Email appears to be a marketing message',
          suggestedActions: ['Archive', 'Mark as read']
        }
      };

      // Mock successful save
      mockSupabaseInstance.select.mockResolvedValue({
        data: [{
          id: 'classification1',
          emailId: 'email1',
          category: 'primary',
          confidence: 0.95,
          createdAt: new Date().toISOString(),
        }],
        error: null,
      });

      // @ts-ignore - Accessing private method for testing
      await AIService.saveClassifications([mockClassification]);

      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('email_classifications');
      expect(mockSupabaseInstance.insert).toHaveBeenCalledWith([mockClassification]);
    });
  });

  describe('basicClassifyEmail', () => {
    it('should classify as important for high priority senders', () => {
      const importantEmail = {
        ...mockEmail,
        fromAddress: 'ceo@company.com',
        subject: 'URGENT: Important update',
      };
      
      const result = AIService['basicClassifyEmail'](importantEmail as Email);
      
      expect(result.category).toBe('URGENT');
      expect(result.priority).toBe('high');
    });

    it('should classify as social for social media emails', () => {
      const socialEmail = {
        ...mockEmail,
        fromAddress: 'notifications@linkedin.com',
        subject: 'You have new connection requests',
      };
      
      const result = AIService['basicClassifyEmail'](socialEmail as Email);
      
      expect(result.category).toBe('SOCIAL');
      expect(result.priority).toBe('low');
    });
  });
});
