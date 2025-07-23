import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createLogger } from '../utils/logger';
import { UserService } from './user.service';

const logger = createLogger('GmailService');

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: any;
}

export interface EmailDetails {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  isDraft: boolean;
  isSpam: boolean;
  isTrash: boolean;
  attachments?: Array<{
    attachmentId: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }>;
}

export class GmailService {
  private oauth2Client: OAuth2Client;
  private accessToken: string;
  private refreshToken: string;
  private userId: string | null = null;

  constructor(accessToken: string, refreshToken: string, userId?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId || null;

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      if (credentials.access_token) {
        this.accessToken = credentials.access_token;
        this.oauth2Client.setCredentials(credentials);
        
        // Update tokens in database if userId is available
        if (this.userId) {
          await UserService.updateUserTokens(this.userId, {
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token || this.refreshToken,
            expires_in: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : undefined,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  async fetchLatestEmails(maxResults: number = 100, pageToken?: string): Promise<{ messages: GmailMessage[], nextPageToken?: string | null | undefined }> {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: Math.min(maxResults, 100), // Gmail API max is 100 per page
        pageToken,
        labelIds: ['INBOX'],
        q: 'newer_than:7d', // Only fetch emails from the last 7 days
      });

      const messages = (response.data.messages || [])
        .filter((msg): msg is { id: string; threadId: string } => 
          msg !== null && 
          msg !== undefined && 
          typeof msg.id === 'string' && 
          typeof msg.threadId === 'string'
        )
        .map(msg => ({
          id: msg.id,
          threadId: msg.threadId,
          labelIds: [],
          snippet: '',
          payload: {}
        }));

      return {
        messages,
        nextPageToken: response.data.nextPageToken
      };
    } catch (error: any) {
      if (error.code === 401) {
        await this.refreshAccessToken();
        return this.fetchLatestEmails(maxResults);
      }
      logger.error('Error fetching latest emails:', error);
      throw error;
    }
  }

  async getEmailDetails(messageId: string): Promise<EmailDetails> {
    // Add rate limiting delay to avoid hitting Gmail API quotas
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between requests
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      
      const response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const message = response.data;
      const headers = message.payload?.headers || [];
      const getHeader = (name: string) => {
        const header = headers.find(h => h.name && h.name.toLowerCase() === name.toLowerCase());
        return header?.value || '';
      };

      // Process email body and attachments
      let body = '';
      const attachments: any[] = [];
      
      const processPart = (part: any) => {
        if (part.parts) {
          part.parts.forEach(processPart);
        }

        const contentType = part.mimeType || '';
        const isHtml = contentType.includes('text/html');
        const isPlain = contentType.includes('text/plain');
        const isAttachment = part.filename && part.filename.length > 0;

        if (isHtml || isPlain) {
          const data = part.body.data || '';
          const text = Buffer.from(data, 'base64').toString('utf-8');
          if (isHtml) {
            body = text;
          } else if (!body) {
            body = text;
          }
        } else if (isAttachment) {
          attachments.push({
            attachmentId: part.body.attachmentId,
            fileName: part.filename,
            mimeType: part.mimeType,
            sizeBytes: part.body.size,
          });
        }
      };

      if (message.payload) {
        processPart(message.payload);
      }

      return {
        id: message.id || '',
        threadId: message.threadId || '',
        subject: getHeader('Subject'),
        from: getHeader('From'),
        to: getHeader('To'),
        cc: getHeader('Cc'),
        bcc: getHeader('Bcc'),
        date: getHeader('Date'),
        snippet: message.snippet || '',
        body,
        labels: message.labelIds || [],
        isRead: !message.labelIds?.includes('UNREAD'),
        isStarred: message.labelIds?.includes('STARRED') || false,
        isDraft: message.labelIds?.includes('DRAFT') || false,
        isSpam: message.labelIds?.includes('SPAM') || false,
        isTrash: message.labelIds?.includes('TRASH') || false,
        attachments: attachments.length > 0 ? attachments : undefined,
      };
    } catch (error: any) {
      if (error.code === 401) {
        await this.refreshAccessToken();
        return this.getEmailDetails(messageId);
      }
      logger.error(`Error getting email details for ${messageId}:`, error);
      throw error;
    }
  }
}

export default GmailService;
