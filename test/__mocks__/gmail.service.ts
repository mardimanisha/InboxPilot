import { GmailMessage } from '../../backend/src/services/gmail.service';

// Helper function to create a mock GmailMessage with required fields
const createMockMessage = (id: string, threadId: string, payload: any = {}) => ({
  id,
  threadId,
  labelIds: [],
  snippet: '',
  payload: {
    headers: [
      { name: 'From', value: payload.from || 'test@example.com' },
      { name: 'To', value: payload.to || 'user@example.com' },
      { name: 'Subject', value: payload.subject || 'Test Email' },
      { name: 'Date', value: payload.date || new Date().toISOString() },
    ],
    parts: [
      {
        mimeType: 'text/plain',
        body: { data: Buffer.from(payload.body || 'Test email body').toString('base64') },
      },
    ],
    ...payload
  },
  ...(payload.labelIds && { labelIds: payload.labelIds })
});

export const mockGmailMessages: GmailMessage[] = [
  createMockMessage('msg1', 'thread1', {
    subject: 'Test Email 1',
    from: 'test1@example.com',
    body: 'This is the full body of test email 1',
    labelIds: ['INBOX'],
  }),
  createMockMessage('msg2', 'thread2', {
    subject: 'Important Update',
    from: 'important@company.com',
    body: 'This is an important update about your account',
    labelIds: ['IMPORTANT', 'INBOX'],
  }),
];

export class MockGmailService {
  async fetchLatestEmails(maxResults = 10) {
    return {
      messages: mockGmailMessages.slice(0, maxResults),
      nextPageToken: undefined,
    };
  }

  async getEmailDetails(messageId: string) {
    const email = mockGmailMessages.find(msg => msg.id === messageId);
    if (!email) throw new Error('Email not found');
    return email;
  }
}
