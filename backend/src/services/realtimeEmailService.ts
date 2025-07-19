import { Database } from '../types/supabase';
import { RedisService } from '../services/redis';
import { logger } from '../utils/logger';
import { EmailRepository } from '../repository/emailRepository';

export class RealtimeEmailService {
  private static instance: RealtimeEmailService;
  private emailRepository: EmailRepository;
  private supabase: Database;
  private channel: any;

  private constructor(supabase: Database, redisService: RedisService) {
    this.emailRepository = new EmailRepository(redisService, supabase);
    this.supabase = supabase;
    this.setupRealtimeListeners();
  }

  public static getInstance(supabase: Database, redisService: RedisService): RealtimeEmailService {
    if (!RealtimeEmailService.instance) {
      RealtimeEmailService.instance = new RealtimeEmailService(supabase, redisService);
    }
    return RealtimeEmailService.instance;
  }

  private setupRealtimeListeners(): void {
    // Listen for new emails
    this.channel = this.supabase
      .channel('emails')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'emails',
      }, (payload) => {
        this.handleEmailChange(payload);
      })
      .subscribe();

    // Listen for classification changes
    this.supabase
      .channel('email_classifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'email_classifications',
      }, (payload) => {
        this.handleClassificationChange(payload);
      })
      .subscribe();
  }

  private async handleEmailChange(payload: any): Promise<void> {
    try {
      const { eventType, new: newEmail, old: oldEmail } = payload;
      const userId = newEmail?.user_id || oldEmail?.user_id;

      if (!userId) return;

      // Sync changes to Redis
      switch (eventType) {
        case 'INSERT':
          await this.emailRepository.syncEmails(userId);
          break;
        case 'UPDATE':
          await this.emailRepository.syncEmails(userId);
          break;
        case 'DELETE':
          await this.redisService.removeFromCache(oldEmail.gmail_id);
          break;
      }
    } catch (error) {
      logger.error('Error handling email change', { error, payload });
    }
  }

  private async handleClassificationChange(payload: any): Promise<void> {
    try {
      const { eventType, new: newClassification, old: oldClassification } = payload;
      const userId = newClassification?.user_id || oldClassification?.user_id;

      if (!userId) return;

      // Sync classification changes to Redis
      switch (eventType) {
        case 'INSERT':
          await this.emailRepository.syncEmails(userId);
          break;
        case 'UPDATE':
          await this.emailRepository.syncEmails(userId);
          break;
        case 'DELETE':
          await this.redisService.removeFromCache(oldClassification.email_id);
          break;
      }
    } catch (error) {
      logger.error('Error handling classification change', { error, payload });
    }
  }

  public async getRealtimeUpdates(userId: string): Promise<any> {
    try {
      // Get initial state
      const { emails, total } = await this.emailRepository.getPaginatedEmails(
        userId,
        1,
        10
      );

      // Return initial state with channel for real-time updates
      return {
        emails,
        total,
        channel: this.channel
      };
    } catch (error) {
      logger.error('Error getting real-time updates', { error });
      throw error;
    }
  }
}
