import { GmailService } from '../backend/src/services/gmail.service';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Define mock functions first
const mockList = jest.fn();
const mockGet = jest.fn();

// Mock googleapis before any imports that might use it
jest.mock('googleapis', () => {
  // Create a real instance of OAuth2Client to mock behavior
  const mockAuth = new OAuth2Client();

  // Mock getAccessToken with proper type assertion
  const mockTokenResponse = { token: 'mock-access-token' } as const;
  jest.spyOn(mockAuth, 'getAccessToken').mockImplementation(() => 
    Promise.resolve(mockTokenResponse)
  );

  // Mock setCredentials
  jest.spyOn(mockAuth, 'setCredentials').mockImplementation(() => ({}));

  // Mock refreshAccessToken with proper type assertion
  const mockRefreshResponse = {
    credentials: {
      access_token: 'new-access-token',
      refresh_token: 'mock-refresh-token',
      expiry_date: Date.now() + 3600 * 1000,
    },
    res: { data: {} },
  } as const;

  jest.spyOn(mockAuth, 'refreshAccessToken').mockImplementation(() => 
    Promise.resolve(mockRefreshResponse as any)
  );

  // Set up the mock implementations
  mockList.mockResolvedValue({
    data: {
      messages: [
        { id: 'msg1', threadId: 'thread1' },
        { id: 'msg2', threadId: 'thread2' },
      ],
      nextPageToken: 'next-page-token',
    },
  });

  mockGet.mockImplementation(({ id }) => {
    return Promise.resolve({
      data: {
        id,
        threadId: `thread-${id}`,
        snippet: 'Test email snippet',
        payload: {
          headers: [
            { name: 'From', value: 'test@example.com' },
            { name: 'To', value: 'user@example.com' },
            { name: 'Subject', value: 'Test Email' },
            { name: 'Date', value: new Date().toISOString() },
          ],
          parts: [
            {
              mimeType: 'text/plain',
              body: { data: Buffer.from('Test email body').toString('base64') },
            },
          ],
        },
        labelIds: ['INBOX'],
      },
    });
  });

  const original = jest.requireActual('googleapis');
  return {
    ...original,
    google: {
      gmail: jest.fn().mockReturnValue({
        users: {
          messages: {
            list: mockList,
            get: mockGet,
          },
        },
      }),
      auth: {
        OAuth2: jest.fn().mockImplementation(() => mockAuth),
      },
    },
  };
});

// Now we can safely use the mocks in our tests
const mockAuth = new OAuth2Client();

describe('GmailService', () => {
  let gmailService: GmailService;
  const mockAccessToken = 'mock-access-token';
  const mockRefreshToken = 'mock-refresh-token';
  const mockUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    gmailService = new GmailService(mockAccessToken, mockRefreshToken, mockUserId);
  });

  describe('fetchLatestEmails', () => {
    it('should fetch latest emails', async () => {
      const result = await gmailService.fetchLatestEmails(2);

      expect(result.messages).toHaveLength(2);
      expect(result.messages[0].id).toBe('msg1');
      expect(result.nextPageToken).toBe('next-page-token');

      expect(google.gmail).toHaveBeenCalledWith({
        version: 'v1',
        auth: expect.any(OAuth2Client),
      });
    });

    it('should handle token refresh when unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).code = 401;

      mockList
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({
          data: { messages: [{ id: 'msg3', threadId: 'thread3' }] },
        });

      const result = await gmailService.fetchLatestEmails(1);

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].id).toBe('msg3');
      expect(mockAuth.refreshAccessToken).toHaveBeenCalled();
    });
  });

  describe('getEmailDetails', () => {
    it('should get email details', async () => {
      const email = await gmailService.getEmailDetails('msg1');

      expect(email.id).toBe('msg1');
      expect(email.subject).toBe('Test Email');
      expect(email.from).toBe('test@example.com');
      expect(email.body).toContain('Test email body');

      expect(mockGet).toHaveBeenCalledWith({
        userId: 'me',
        id: 'msg1',
        format: 'full',
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token', async () => {
      await (gmailService as any).refreshAccessToken();

      expect(mockAuth.refreshAccessToken).toHaveBeenCalled();
      expect(mockAuth.setCredentials).toHaveBeenCalledWith({
        access_token: 'new-access-token',
        refresh_token: 'mock-refresh-token',
        expiry_date: expect.any(Number),
      });
    });
  });
});
