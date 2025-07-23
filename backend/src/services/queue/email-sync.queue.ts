import Queue from 'bull';
import { redisConfig } from '../../config/redis';

export const emailSyncQueue = new Queue('email-sync', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: 1000 // keep up to 1000 failed jobs
  }
});

export default emailSyncQueue;
