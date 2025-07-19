import { Database } from '../types/supabase';
import { RedisService } from '../services/redis';
import { Email, EmailClassification } from '../types/email';
import { logger } from '../utils/logger';

export class EmailRepository {
  private redisService: RedisService;
  private supabase: Database;

  constructor(redisService: RedisService, supabase: Database) {
    this.redisService = redisService;
    this.supabase = supabase;
  }

  // Sync Redis with Supabase
  async syncEmails(userId: string): Promise<void> {
    try {
      // Get emails from Redis
      const redisEmails = await this.redisService.getProcessedEmails(userId);
      
      // Get existing emails from Supabase
      const { data: existingEmails, error: fetchError } = await this.supabase
        .from('emails')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) {
        throw fetchError;
      }

      // Sync emails
      for (const redisEmail of redisEmails) {
        const existingEmail = existingEmails?.find(e => e.gmail_id === redisEmail.gmailId);
        
        if (!existingEmail) {
          // Insert new email
          await this.supabase
            .from('emails')
            .insert({
              user_id: userId,
              gmail_id: redisEmail.gmailId,
              thread_id: redisEmail.threadId,
              from: redisEmail.from,
              to: redisEmail.to,
              subject: redisEmail.subject,
              body: redisEmail.body,
              date: redisEmail.date,
              processed_at: redisEmail.processedAt
            });
        } else if (redisEmail.processedAt > existingEmail.processed_at) {
          // Update existing email if newer
          await this.supabase
            .from('emails')
            .update({
              from: redisEmail.from,
              to: redisEmail.to,
              subject: redisEmail.subject,
              body: redisEmail.body,
              date: redisEmail.date,
              processed_at: redisEmail.processedAt
            })
            .eq('id', existingEmail.id);
        }
      }

      // Sync classifications
      await this.syncClassifications(userId, redisEmails);
    } catch (error) {
      logger.error('Error syncing emails', { error });
      throw error;
    }
  }

  private async syncClassifications(userId: string, emails: Email[]): Promise<void> {
    for (const email of emails) {
      const { data: existingClassification, error: fetchError } = await this.supabase
        .from('email_classifications')
        .select('*')
        .eq('email_id', email.id)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!existingClassification) {
        await this.supabase
          .from('email_classifications')
          .insert({
            email_id: email.id,
            user_id: userId,
            category: email.category,
            confidence: email.confidence,
            reason: email.reason,
            processed_at: email.processedAt
          });
      } else if (email.processedAt > existingClassification.processed_at) {
        await this.supabase
          .from('email_classifications')
          .update({
            category: email.category,
            confidence: email.confidence,
            reason: email.reason,
            processed_at: email.processedAt
          })
          .eq('id', existingClassification.id);
      }
    }
  }

  // Get paginated emails with filtering
  async getPaginatedEmails(
    userId: string,
    page: number,
    pageSize: number,
    category?: string,
    search?: string
  ): Promise<{ emails: Email[]; total: number }> {
    try {
      // Build query
      let query = this.supabase
        .from('emails')
        .select('*, email_classifications(*)')
        .eq('user_id', userId)
        .order('processed_at', { ascending: false });

      // Add category filter if specified
      if (category) {
        query = query.eq('email_classifications.category', category);
      }

      // Add search filter if specified
      if (search) {
        query = query.ilike('subject', `%${search}%`).or(`body.ilike.%${search}%`);
      }

      // Get total count
      const { count, error: countError } = await query.count();
      if (countError) throw countError;

      // Apply pagination
      const { data: emails, error: fetchError } = await query
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (fetchError) throw fetchError;

      return {
        emails: emails.map(email => ({
          ...email,
          category: email.email_classifications?.category || 'unknown',
          confidence: email.email_classifications?.confidence || 0,
          reason: email.email_classifications?.reason || ''
        })),
        total: count || 0
      };
    } catch (error) {
      logger.error('Error fetching paginated emails', { error });
      throw error;
    }
  }
}
