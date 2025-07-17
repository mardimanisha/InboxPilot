import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GmailServiceImpl } from './gmail'
import { GmailEmail, GmailScanRequest, GmailScanResponse, EmailClassification } from '../types/gmail'
import { supabase } from '../lib/supabase'
import { User } from '../types/auth'
import { GmailApiClient } from './gmailClient'
import { OpenAIService } from './openai'
import { RedisService, RedisQueueJob } from './redis'

// Mock Gmail API client
const mockGmailClient = {
  fetchEmails: vi.fn()
}

// Mock OpenAI service
const mockOpenAIService = {
  getInstance: vi.fn().mockReturnValue({
    batchClassifyEmails: vi.fn()
  })
}

// Mock Redis service
const mockRedisService = {
  getInstance: vi.fn().mockReturnValue({
    addToQueue: vi.fn()
  })
}

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ error: null })
  })),
  auth: {
    getSession: vi.fn()
  }
}

// Mock logger
const mockLogger = {
  info: vi.fn(),
  error: vi.fn()
}

// Mock GmailEmail
const mockEmail: GmailEmail = {
  id: '123',
  threadId: '456',
  from: 'test@example.com',
  to: 'user@example.com',
  subject: 'Test Email',
  body: 'This is a test email. Please respond.',
  date: '2024-07-17T15:14:51+05:30',
  labels: ['INBOX'],
  importance: 'normal'
}

// Mock EmailClassification
const mockClassification: EmailClassification = {
  id: '123',
  category: 'actionNeeded',
  confidence: 0.9,
  reason: 'Contains action request'
}

describe('GmailService', () => {
  let service: GmailServiceImpl
  let mockUser: User
  
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Create mock GmailApiClient
    mockUser = {
      id: 'test-user',
      email: 'test@example.com',
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      google_id: 'test-google-id'
    }
    
    // Set up service with mocks
    service = await GmailServiceImpl.create()
    
    // Mock dependencies
    vi.mock('../lib/supabase', () => ({
      supabase: mockSupabase
    }))
    
    vi.mock('./openai', () => ({
      OpenAIService: mockOpenAIService
    }))
    
    vi.mock('./redis', () => ({
      RedisService: mockRedisService
    }))
    
    vi.mock('../utils/logger', () => ({
      createLogger: vi.fn().mockReturnValue(mockLogger)
    }))
  })

  it('should create service instance', async () => {
    const service = await GmailServiceImpl.create()
    expect(service).toBeDefined()
  })

  it('should initialize with config', async () => {
    const config = {
      apiKey: 'test-api-key',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret'
    }
    
    await service.initialize(config)
    expect(service.getConfig()).toEqual({
      ...config,
      clientSecret: 'test-client-secret'
    })
  })

  it('should scan inbox and classify emails', async () => {
    // Arrange
    const scanRequest: GmailScanRequest = {
      userId: 'test-user-id',
      maxResults: 100,
      pageToken: undefined,
      includeSpamTrash: false
    }

    // Mock Gmail API response
    mockGmailClient.fetchEmails.mockResolvedValue([mockEmail])
    
    // Mock Supabase insert
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null })
    })

    // Mock Supabase session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: scanRequest.userId } } },
      error: null
    })

    // Act
    const result = await service.scanInbox(scanRequest)

    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith('Starting inbox scan', { userId: scanRequest.userId })
    expect(mockGmailClient.fetchEmails).toHaveBeenCalledWith(scanRequest.maxResults, scanRequest.pageToken)
    expect(result.emails.length).toBe(1)
    expect(result.classifications.length).toBe(1)
    expect(result.classifications[0].category).toBe('action_needed')
    expect(mockLogger.info).toHaveBeenCalledWith('Successfully stored emails and classifications', expect.any(Object))
  })

  it('should handle error during inbox scan', async () => {
    // Arrange
    const scanRequest: GmailScanRequest = {
      userId: 'test-user-id',
      maxResults: 100,
      pageToken: undefined,
      includeSpamTrash: false
    }

    // Mock Gmail API error
    const error = new Error('API error')
    mockGmailClient.fetchEmails.mockRejectedValue(error)

    // Act & Assert
    await expect(service.scanInbox(scanRequest)).rejects.toThrow()
    expect(mockLogger.error).toHaveBeenCalledWith('Error scanning inbox', { error })
  })

  it('should scan inbox successfully', async () => {
    // Mock Gmail API response
    mockGmailClient.fetchEmails.mockResolvedValue([mockEmail])
    
    // Mock OpenAI classification
    mockOpenAIService.getInstance().batchClassifyEmails.mockResolvedValue([mockClassification])
    
    // Mock Supabase insert
    mockSupabase.from().insert.mockResolvedValue({ error: null })
    
    // Mock Redis queue
    mockRedisService.getInstance().addToQueue.mockResolvedValue()
    
    const request: GmailScanRequest = {
      userId: mockUser.id,
      maxResults: 10
    }
    
    const result = await service.scanInbox(request)
    
    expect(result).toEqual({
      emails: [mockEmail],
      classifications: [mockClassification],
      totalScanned: 1
    })
    
    expect(mockGmailClient.fetchEmails).toHaveBeenCalledWith(10)
    expect(mockOpenAIService.getInstance().batchClassifyEmails).toHaveBeenCalledWith([mockEmail.body])
    expect(mockSupabase.from().insert).toHaveBeenCalled()
    expect(mockRedisService.getInstance().addToQueue).toHaveBeenCalled()
  })

  it('should handle Gmail API error', async () => {
    const error = new Error('Gmail API error')
    mockGmailClient.fetchEmails.mockRejectedValue(error)
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await expect(service.scanInbox(request)).rejects.toThrow(error)
    expect(mockLogger.error).toHaveBeenCalledWith('Error scanning inbox', expect.any(Object))
  })

  it('should handle OpenAI classification error', async () => {
    mockGmailClient.fetchEmails.mockResolvedValue([mockEmail])
    const error = new Error('OpenAI error')
    mockOpenAIService.getInstance().batchClassifyEmails.mockRejectedValue(error)
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await expect(service.scanInbox(request)).rejects.toThrow(error)
    expect(mockLogger.error).toHaveBeenCalledWith('Error classifying emails', expect.any(Object))
  })

  it('should handle Supabase error', async () => {
    mockGmailClient.fetchEmails.mockResolvedValue([mockEmail])
    mockOpenAIService.getInstance().batchClassifyEmails.mockResolvedValue([mockClassification])
    const error = new Error('Supabase error')
    mockSupabase.from().insert.mockResolvedValue({ error })
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await expect(service.scanInbox(request)).rejects.toThrow(error)
    expect(mockLogger.error).toHaveBeenCalledWith('Error storing emails', expect.any(Object))
  })

  it('should handle Redis error', async () => {
    mockGmailClient.fetchEmails.mockResolvedValue([mockEmail])
    mockOpenAIService.getInstance().batchClassifyEmails.mockResolvedValue([mockClassification])
    mockSupabase.from().insert.mockResolvedValue({ error: null })
    const error = new Error('Redis error')
    mockRedisService.getInstance().addToQueue.mockRejectedValue(error)
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await expect(service.scanInbox(request)).rejects.toThrow(error)
    expect(mockLogger.error).toHaveBeenCalledWith('Error adding to processing queue', expect.any(Object))
  })

  it('should classify emails in batches', async () => {
    // Create 10 mock emails
    const emails = Array.from({ length: 10 }, (_, i) => ({
      ...mockEmail,
      id: `email-${i}`,
      body: `Email body ${i}`
    }))
    
    // Mock Gmail API response
    mockGmailClient.fetchEmails.mockResolvedValue(emails)
    
    // Mock OpenAI responses
    mockOpenAIService.getInstance().batchClassifyEmails.mockResolvedValue(
      emails.map(email => ({
        id: email.id,
        category: 'normal',
        confidence: 0.8,
        reason: 'Initial classification'
      }))
    )
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await service.scanInbox(request)
    
    // Verify OpenAI was called twice (batch size = 5)
    expect(mockOpenAIService.getInstance().batchClassifyEmails).toHaveBeenCalledTimes(2)
    expect(mockOpenAIService.getInstance().batchClassifyEmails).toHaveBeenCalledWith(
      emails.slice(0, 5).map(email => email.body)
    )
    expect(mockOpenAIService.getInstance().batchClassifyEmails).toHaveBeenCalledWith(
      emails.slice(5).map(email => email.body)
    )
  })

  it('should handle partial failures gracefully', async () => {
    // Create 2 mock emails
    const emails = [
      mockEmail,
      { ...mockEmail, id: '124', body: 'Second test email' }
    ]
    
    // Mock Gmail API response
    mockGmailClient.fetchEmails.mockResolvedValue(emails)
    
    // Mock OpenAI to fail on second email
    mockOpenAIService.getInstance().batchClassifyEmails.mockImplementation((emails: string[]) => {
      if (emails.includes('Second test email')) {
        throw new Error('OpenAI error')
      }
      return Promise.resolve([mockClassification])
    })
    
    const request: GmailScanRequest = {
      userId: mockUser.id
    }
    
    await expect(service.scanInbox(request)).rejects.toThrow()
    
    // Verify first email was still processed
    expect(mockSupabase.from().insert).toHaveBeenCalled()
    expect(mockRedisService.getInstance().addToQueue).toHaveBeenCalled()
  })
})
