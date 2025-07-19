import { logger } from '../utils/logger';
import { EmailError } from '../types/errors';
import { RedisService } from './redis';

export class EmailErrorHandler {
  private static instance: EmailErrorHandler;
  private redisService: RedisService;
  private readonly ERROR_KEY = 'email_errors';

  private constructor(redisService: RedisService) {
    this.redisService = redisService;
  }

  public static getInstance(redisService: RedisService): EmailErrorHandler {
    if (!EmailErrorHandler.instance) {
      EmailErrorHandler.instance = new EmailErrorHandler(redisService);
    }
    return EmailErrorHandler.instance;
  }

  // Handle email processing errors
  public async handleError(error: Error, userId: string, context: any): Promise<void> {
    try {
      const errorData: EmailError = {
        userId,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        context,
        retryCount: 0
      };

      // Log error
      logger.error('Email processing error', { error: errorData });

      // Store in Redis for monitoring
      await this.redisService.addToErrorQueue(errorData);

      // Return error for frontend handling
      throw error;
    } catch (error) {
      logger.error('Error handling failed', { error });
      throw error;
    }
  }

  // Handle Redis failures with Supabase fallback
  public async handleRedisFailure(
    error: Error,
    userId: string,
    fallbackFn: () => Promise<any>
  ): Promise<any> {
    try {
      logger.warn('Redis failure, falling back to Supabase', { error });
      
      // Try Redis first
      throw error; // Simulate Redis failure for testing
    } catch (redisError) {
      // Fallback to Supabase
      logger.info('Falling back to Supabase', { userId });
      return fallbackFn();
    }
  }

  // Handle Gmail API errors
  public async handleGmailError(
    error: Error,
    userId: string,
    retryCount: number = 0,
    maxRetries: number = 3
  ): Promise<void> {
    try {
      if (retryCount >= maxRetries) {
        throw new Error(`Max retries (${maxRetries}) exceeded: ${error.message}`);
      }

      // Calculate exponential backoff
      const backoff = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.
      logger.warn('Gmail API error, retrying with backoff', { 
        error: error.message,
        retryCount,
        backoff 
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, backoff));

      // Retry
      throw error; // Simulate retry for testing
    } catch (retryError) {
      // Log final error
      logger.error('Failed after all retries', { error: retryError });
      throw retryError;
    }
  }
}
