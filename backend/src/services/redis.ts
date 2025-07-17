import { createLogger } from '../utils/logger'
import { GmailEmail, EmailClassification } from '../types/gmail'
import { EmailCategory } from '../../../src/types/email'
import Redis from 'ioredis'
import { config } from '../config'
import { User } from '../types/auth'

const logger = createLogger('RedisService')

export interface RedisQueueJob {
  userId: string
  emails: GmailEmail[]
  classifications: EmailClassification[]
  timestamp: string
}

export interface ProcessedEmail {
  id: string
  userId: string
  subject: string
  content: string
  classification: {
    category: EmailCategory
    confidence: number
    reason: string
  }
  processedAt: string
  sender: string
  time: string
  preview: string
  unread: boolean
  category: EmailCategory
}

export class RedisService {
  private static instance: RedisService
  private client: Redis | null = null;

  private readonly QUEUE_KEY = 'email_processing_queue'
  private readonly PROCESSING_KEY = 'email_processing'
  private readonly PROCESSED_KEY = 'processed_emails'

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  private async initialize(): Promise<void> {
    try {
      if (this.client) {
        return
      }

      // Initialize Redis client with configuration
      this.client = new Redis({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
        maxRetriesPerRequest: 5,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        }
      })

      // Handle connection events
      this.client.on('connect', () => {
        logger.info('Redis client connected')
        // Start processing queue on connection
        this.processQueue()
      })

      this.client.on('error', (error) => {
        logger.error('Redis client error', { error })
      })

      this.client.on('end', () => {
        logger.info('Redis client disconnected')
      })

      await this.client.ping()
    } catch (error) {
      logger.error('Error initializing Redis client', { error })
      throw error
    }
  }

  async addToQueue(job: RedisQueueJob): Promise<void> {
    try {
      // Ensure client is initialized before use
      if (!this.client) {
        await this.initialize()
        if (!this.client) {
          throw new Error('Failed to initialize Redis client')
        }
      }
      
      const jobString = JSON.stringify(job)
      await this.client.rpush('email_processing_queue', jobString)
      logger.info('Added job to Redis queue', { userId: job.userId })
    } catch (error) {
      logger.error('Error adding job to queue', { error, userId: job.userId })
      throw error
    }
  }

  async processQueue(): Promise<void> {
    try {
      if (!this.client) {
        await this.initialize()
      }

      // Double-check client exists and create duplicate
      const client = this.client
      if (!client) {
        throw new Error('Redis client is not initialized')
      }
      const queueClient = client.duplicate()
      
      while (true) {
        const jobJson = await queueClient.lpop(this.QUEUE_KEY)
        if (!jobJson) {
          // Sleep for a bit before checking again
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        const job: RedisQueueJob = JSON.parse(jobJson)
        logger.info('Processing job from queue', { jobId: job.timestamp })

        // Store in processing set to prevent duplicate processing
        const processingKey = `${this.PROCESSING_KEY}:${job.timestamp}`
        if (!this.client) {
          logger.error('Redis client not initialized')
          continue
        }

        const alreadyProcessing = await this.client.sismember(this.PROCESSING_KEY, job.timestamp)
        
        if (alreadyProcessing) {
          logger.warn('Job already being processed, skipping', { jobId: job.timestamp })
          continue
        }

        await this.client.sadd(this.PROCESSING_KEY, job.timestamp)

        // Process each email
        for (let i = 0; i < job.emails.length; i++) {
          const email = job.emails[i]
          const classification = job.classifications[i]
          const processedEmail: ProcessedEmail = {
            id: email.id,
            userId: job.userId,
            subject: email.subject,
            content: email.body,
            classification,
            processedAt: new Date().toISOString(),
            sender: email.from,
            time: email.date,
            preview: email.body.substring(0, 100),
            unread: true, // Default to true since we haven't read it yet
            category: classification.category
          }

          // Store processed email in Redis
          await this.client.hset(
            this.PROCESSED_KEY,
            processedEmail.id,
            JSON.stringify(processedEmail)
          )
        }

        // Remove from processing set
        await this.client.srem(this.PROCESSING_KEY, job.timestamp)
        logger.info('Job processed successfully', { jobId: job.timestamp })
      }
    } catch (error) {
      logger.error('Error processing queue', { error })
      // Reconnect and continue processing
      await this.initialize()
      this.processQueue()
    }
  }

  public async getProcessedEmails(userId: string): Promise<ProcessedEmail[]> {
    try {
      if (!this.client) {
        await this.initialize()
        if (!this.client) {
          throw new Error('Redis client initialization failed')
        }
      }

      const allEmails = await this.client.hgetall(this.PROCESSED_KEY)
      return Object.entries(allEmails)
        .map(([id, emailJson]) => ({
          ...JSON.parse(emailJson),
          id
        }))
        .filter(email => email.userId === userId)
    } catch (error) {
      logger.error('Error getting processed emails', { error })
      throw error
    }
  }

  public async clearProcessedEmails(): Promise<void> {
    try {
      if (!this.client) {
        await this.initialize();
      }
      await this.client!.del(this.PROCESSED_KEY);
      logger.info('Processed emails cleared');
    } catch (error) {
      logger.error('Error clearing processed emails', { error });
      throw error;
    }
  }

  public async getQueueLength(): Promise<number> {
    try {
      if (!this.client) {
        await this.initialize()
        if (!this.client) {
          throw new Error('Redis client initialization failed')
        }
      }
      
      return await this.client.llen(this.QUEUE_KEY)
    } catch (error) {
      logger.error('Error getting queue length', { error })
      throw error
    }
  }

  public async getNextJob(): Promise<RedisQueueJob | null> {
    try {
      if (!this.client) {
        await this.initialize()
      }
      
      // Type assertion since we know client is initialized
      const jobString = await (this.client as Redis).lpop(this.QUEUE_KEY)
      if (!jobString) {
        return null
      }
      
      return JSON.parse(jobString)
    } catch (error) {
      logger.error('Error getting next job from queue', { error })
      throw error
    }
  }
}
