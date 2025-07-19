import { logger } from '../utils/logger';
import { RedisService } from './redis';
import { EmailMetrics, EmailError } from '../types/monitoring';
import { EmailRepository } from '../repository/emailRepository';

export class MonitoringService {
  private static instance: MonitoringService;
  private redisService: RedisService;
  private emailRepository: EmailRepository;
  private readonly METRICS_KEY = 'email_metrics';

  private constructor(redisService: RedisService, emailRepository: EmailRepository) {
    this.redisService = redisService;
    this.emailRepository = emailRepository;
    this.setupMetricsTracking();
  }

  public static getInstance(redisService: RedisService, emailRepository: EmailRepository): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(redisService, emailRepository);
    }
    return MonitoringService.instance;
  }

  private async setupMetricsTracking(): Promise<void> {
    try {
      // Track email processing metrics
      setInterval(async () => {
        await this.trackProcessingMetrics();
      }, 60000); // Every minute

      // Track error metrics
      setInterval(async () => {
        await this.trackErrorMetrics();
      }, 300000); // Every 5 minutes

      // Track Redis health
      setInterval(async () => {
        await this.trackRedisHealth();
      }, 30000); // Every 30 seconds
    } catch (error) {
      logger.error('Error setting up metrics tracking', { error });
    }
  }

  private async trackProcessingMetrics(): Promise<void> {
    try {
      // Get Redis queue length
      const queueLength = await this.redisService.getQueueLength();
      
      // Get processing rate
      const { data: processedEmails, error: fetchError } = await this.emailRepository
        .supabase
        .from('emails')
        .select('processed_at')
        .eq('processed_at', '>=', new Date(Date.now() - 60000).toISOString())
        .count();

      if (fetchError) {
        throw fetchError;
      }

      // Store metrics
      const metrics: EmailMetrics = {
        timestamp: new Date().toISOString(),
        queueLength,
        processingRate: processedEmails?.count || 0,
        redisHealth: await this.redisService.checkHealth()
      };

      await this.redisService.storeMetrics(metrics);
    } catch (error) {
      logger.error('Error tracking processing metrics', { error });
    }
  }

  private async trackErrorMetrics(): Promise<void> {
    try {
      // Get recent errors
      const errors = await this.redisService.getRecentErrors();

      // Calculate error rates
      const errorStats = {
        totalErrors: errors.length,
        errorTypes: errors.reduce((acc, error) => {
          acc[error.context] = (acc[error.context] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      // Store error metrics
      await this.redisService.storeErrorMetrics(errorStats);
    } catch (error) {
      logger.error('Error tracking error metrics', { error });
    }
  }

  private async trackRedisHealth(): Promise<void> {
    try {
      const health = await this.redisService.checkHealth();
      
      if (!health.ok) {
        logger.warn('Redis health check failed', { health });
      }

      // Store health metrics
      await this.redisService.storeHealthMetrics(health);
    } catch (error) {
      logger.error('Error tracking Redis health', { error });
    }
  }

  // Get metrics for dashboard
  public async getDashboardMetrics(): Promise<EmailMetrics> {
    try {
      const metrics = await this.redisService.getLatestMetrics();
      return metrics || {
        timestamp: new Date().toISOString(),
        queueLength: 0,
        processingRate: 0,
        redisHealth: {
          ok: true,
          latency: 0,
          memoryUsage: 0
        }
      };
    } catch (error) {
      logger.error('Error getting dashboard metrics', { error });
      throw error;
    }
  }
}
