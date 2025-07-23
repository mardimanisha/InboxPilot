import { supabase } from '../lib/supabase'
import { Email, EmailAttachment, EmailClassification } from '../types/email'
import { createLogger } from '../utils/logger'

const logger = createLogger('EmailService')

export class EmailService {
  /**
   * Save a batch of emails to the database
   * @param emails Array of emails to save
   * @returns Array of saved email IDs
   */
  static async saveEmails(emails: Email[]): Promise<string[]> {
    try {
      const insertions = emails.map(email => ({
        ...email,
        user_id: email.userId,
        gmail_message_id: email.gmailMessageId,
        thread_id: email.threadId,
        subject: email.subject,
        from_address: email.fromAddress,
        to_address: email.toAddress,
        cc_address: email.ccAddress,
        bcc_address: email.bccAddress,
        date: email.date,
        snippet: email.snippet,
        body: email.body,
        labels: email.labels,
        is_read: email.isRead,
        is_starred: email.isStarred,
        is_draft: email.isDraft,
        is_spam: email.isSpam,
        is_trash: email.isTrash
      }))

      const { data, error } = await supabase
        .from('emails')
        .insert(insertions)
        .select('id')

      if (error) {
        logger.error('Failed to save emails:', { error, insertions })
        // Optionally: update onboarding progress as failed here
        throw new Error(`Failed to save emails: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when saving emails', { insertions });
        throw new Error('No data returned from Supabase when saving emails');
      }
      return data.map(d => d.id);
    } catch (error) {
      logger.error('Unexpected error saving emails:', { error })
      throw error
    }
  }

  /**
   * Save a batch of email attachments to the database
   * @param attachments Array of email attachments to save
   * @returns Array of saved attachment IDs
   */
  static async saveAttachments(attachments: Omit<EmailAttachment, 'id'>[]): Promise<string[]> {
    if (attachments.length === 0) {
      return [];
    }

    try {
      const insertions = attachments.map(attachment => ({
        email_id: attachment.emailId,
        file_name: attachment.fileName,
        mime_type: attachment.mimeType,
        size_bytes: attachment.sizeBytes,
        attachment_id: attachment.attachmentId,
        created_at: attachment.createdAt
      }));

      const { data, error } = await supabase
        .from('email_attachments')
        .insert(insertions)
        .select('id');

      if (error) {
        logger.error('Failed to save email attachments:', { error, insertions });
        throw new Error(`Failed to save email attachments: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when saving email attachments', { insertions });
        throw new Error('No data returned from Supabase when saving email attachments');
      }
      return data.map(d => d.id);
    } catch (error) {
      logger.error('Unexpected error saving email attachments:', { error });
      throw error;
    }
  }

  /**
   * Save email classifications
   * @param classifications Array of classifications to save
   * @returns Array of saved classification IDs
   */
  static async saveClassifications(classifications: EmailClassification[]): Promise<string[]> {
    try {
      const insertions = classifications.map(classification => ({
        ...classification,
        email_id: classification.emailId,
        user_id: classification.userId,
        classification_type: classification.classificationType,
        classification_score: classification.classificationScore,
        classification_data: classification.classificationData
      }))

      const { data, error } = await supabase
        .from('email_classifications')
        .insert(insertions)
        .select('id')

      if (error) {
        logger.error('Failed to save classifications:', { error, insertions })
        throw new Error(`Failed to save classifications: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when saving classifications', { insertions });
        throw new Error('No data returned from Supabase when saving classifications');
      }
      return data.map(d => d.id);
    } catch (error) {
      logger.error('Unexpected error saving classifications:', { error })
      throw error
    }
  }

  /**
   * Get emails for a user
   * @param userId User ID
   * @param options Query options
   * @returns Array of emails
   */
  static async getUserEmails(userId: string, options?: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    isRead?: boolean
    labels?: string[]
  }): Promise<Email[]> {
    try {
      let queryBuilder = supabase
        .from('emails')
        .select('*')
        .eq('user_id', userId)

      // Apply pagination
      if (options?.limit) {
        queryBuilder = queryBuilder.range(options.offset || 0, (options.offset || 0) + options.limit - 1)
      } else if (options?.offset) {
        queryBuilder = queryBuilder.range(options.offset, options.offset + 49) // Default to 50 items if no limit specified
      }

      // Apply filters
      if (options?.startDate) queryBuilder = queryBuilder.gte('date', options.startDate)
      if (options?.endDate) queryBuilder = queryBuilder.lte('date', options.endDate)
      if (options?.isRead !== undefined) queryBuilder = queryBuilder.eq('is_read', options.isRead)
      if (options?.labels?.length) queryBuilder = queryBuilder.contains('labels', options.labels)

      const { data, error } = await queryBuilder.order('date', { ascending: false });

      if (error) {
        logger.error('Failed to fetch user emails:', { error, userId, options });
        throw new Error(`Failed to fetch user emails: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when fetching user emails', { userId, options });
        throw new Error('No data returned from Supabase when fetching user emails');
      }
      return data.map(row => ({
        id: row.id,
        userId: row.user_id,
        gmailMessageId: row.gmail_message_id,
        threadId: row.thread_id,
        subject: row.subject,
        fromAddress: row.from_address,
        toAddress: row.to_address,
        ccAddress: row.cc_address,
        bccAddress: row.bcc_address,
        date: row.date,
        snippet: row.snippet,
        body: row.body,
        labels: row.labels,
        isRead: row.is_read,
        isStarred: row.is_starred,
        isDraft: row.is_draft,
        isSpam: row.is_spam,
        isTrash: row.is_trash,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    } catch (error) {
      logger.error('Unexpected error fetching user emails:', { error })
      throw error
    }
  }

  /**
   * Get email by ID
   * @param emailId Email ID
   * @returns Email object
   */
  static async getEmail(emailId: string): Promise<Email | null> {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('id', emailId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return null;
        }
        logger.error(`Failed to get email ${emailId}:`, { error });
        throw new Error(`Failed to get email ${emailId}: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error(`No data returned for email ${emailId}`);
        return null;
      }
      // Map database fields to our Email type
      return {
        id: data.id,
        userId: data.user_id,
        gmailMessageId: data.gmail_message_id,
        threadId: data.thread_id,
        subject: data.subject,
        fromAddress: data.from_address,
        toAddress: data.to_address,
        ccAddress: data.cc_address,
        bccAddress: data.bcc_address,
        date: new Date(data.date),
        snippet: data.snippet,
        body: data.body,
        labels: data.labels || [],
        isRead: data.is_read,
        isStarred: data.is_starred,
        isDraft: data.is_draft,
        isSpam: data.is_spam,
        isTrash: data.is_trash,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      logger.error(`Failed to get email ${emailId}:`, { error })
      throw error
    }
  }

  /**
   * Update email read status
   * @param emailId Email ID
   * @param isRead New read status
   * @returns Updated email
   */
  static async updateEmailReadStatus(emailId: string, isRead: boolean): Promise<Email | null> {
    try {
      const { data, error } = await supabase
        .from('emails')
        .update({ is_read: isRead })
        .eq('id', emailId)
        .select('*')
        .single();

      if (error) {
        logger.error('Failed to update email read status:', { error, emailId, isRead });
        throw new Error(`Failed to update email read status: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when updating email read status', { emailId, isRead });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        gmailMessageId: data.gmail_message_id,
        threadId: data.thread_id,
        subject: data.subject,
        fromAddress: data.from_address,
        toAddress: data.to_address,
        ccAddress: data.cc_address,
        bccAddress: data.bcc_address,
        date: data.date,
        snippet: data.snippet,
        body: data.body,
        labels: data.labels,
        isRead: data.is_read,
        isStarred: data.is_starred,
        isDraft: data.is_draft,
        isSpam: data.is_spam,
        isTrash: data.is_trash,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      logger.error('Unexpected error updating email read status:', { error })
      throw error
    }
  }
}
