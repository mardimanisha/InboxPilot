import 'dotenv/config';
import { Job, DoneCallback } from 'bull';
import { GmailService } from './services/gmail.service';
import { EmailService } from './services/email.service';
import { AIService } from './services/ai.service';
import { ProgressService } from './services/progress.service';
import { createLogger } from './utils/logger';
import { Email, EmailAttachment } from './types/email';
import emailSyncQueue from './services/queue/email-sync.queue';
import { UserService } from './services/user.service';

const logger = createLogger('Worker')

logger.info('Worker process started.')

emailSyncQueue.process(async (job: Job<{ userId: string; batchSize?: number }>, done: DoneCallback) => {
  const { userId, batchSize = 100 } = job.data;
  let progressId: string | null = null;
  
  logger.info(`Processing email-sync job for user: ${userId}`, { jobId: job.id, batchSize });

  try {
    // Create progress tracking
    progressId = await ProgressService.createProgress(userId, job.id.toString());
    
    // Update progress: Step 1 - Initializing
    await ProgressService.updateProgress(progressId, 1);
    // TODO: Add message to progress if needed in the future
    
    // Get user tokens
    const tokens = await UserService.getUserTokens(userId);

    if (!tokens || !tokens.access_token || !tokens.refresh_token) {
      logger.error(`No tokens found for user ${userId}. Skipping job.`);
      throw new Error(`No tokens found for user ${userId}`);
    }

    // Initialize Gmail service
    const gmailService = new GmailService(tokens.access_token, tokens.refresh_token, userId);
    
    // Track processed emails
    let totalProcessed = 0;
    let nextPageToken: string | undefined;
    const BATCH_SIZE = Math.min(batchSize, 500); // Max 500 emails per batch
    
    do {
      // Update progress - using step 2 for fetching emails
      if (progressId) {
        await ProgressService.updateProgress(progressId, 2);
      }
      
      // Fetch emails with pagination
      const { messages, nextPageToken: newPageToken } = await gmailService.fetchLatestEmails(
        BATCH_SIZE,
        nextPageToken || undefined // Convert null to undefined to match expected type
      );
      
      nextPageToken = newPageToken || undefined; // Ensure we don't set null
      
      if (!messages.length) {
        logger.info('No more emails to process');
        break;
      }
      
      logger.info(`Processing batch of ${messages.length} emails for user ${userId}`);
      
      // Process emails in batches
      const emailsToSave: Email[] = [];
      const attachmentsToSave: Omit<EmailAttachment, 'id'>[] = [];
      
      for (const message of messages) {
        if (!message.id) continue;

        try {
          const emailDetails = await gmailService.getEmailDetails(message.id);
          
          // Convert Gmail message to our Email format
          const email: Email = {
            id: message.id,
            userId,
            gmailMessageId: message.id,
            threadId: message.threadId || '',
            subject: emailDetails.subject || '',
            fromAddress: emailDetails.from || '',
            toAddress: emailDetails.to || '',
            ccAddress: emailDetails.cc,
            bccAddress: emailDetails.bcc,
            date: new Date(emailDetails.date || Date.now()),
            snippet: emailDetails.snippet || '',
            body: emailDetails.body || '',
            labels: emailDetails.labels || [],
            isRead: emailDetails.isRead || false,
            isStarred: emailDetails.isStarred || false,
            isDraft: emailDetails.isDraft || false,
            isSpam: emailDetails.isSpam || false,
            isTrash: emailDetails.isTrash || false,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          emailsToSave.push(email);
          totalProcessed++;

          // Process attachments if any
          if (emailDetails.attachments?.length) {
            const attachments = emailDetails.attachments.map(attachment => ({
              emailId: message.id!,
              fileName: attachment.fileName,
              mimeType: attachment.mimeType,
              sizeBytes: attachment.sizeBytes,
              attachmentId: attachment.attachmentId,
              createdAt: new Date()
            }));
            attachmentsToSave.push(...attachments);
          }
          
          // Update progress every 10 emails
          if (totalProcessed % 10 === 0) {
            await ProgressService.updateProgress(progressId, 3);
          }
        } catch (error) {
          logger.error(`Failed to process email ${message.id}:`, { error });
          continue;
        }
      }

      // Save batch to database
      if (emailsToSave.length > 0) {
        logger.info(`Saving batch of ${emailsToSave.length} emails to database...`);
        await EmailService.saveEmails(emailsToSave);
      }

      if (attachmentsToSave.length > 0) {
        logger.info(`Saving ${attachmentsToSave.length} attachments to database...`);
        await EmailService.saveAttachments(attachmentsToSave);
      }
      
      // Classify emails in batches to avoid rate limiting
      if (emailsToSave.length > 0) {
        await ProgressService.updateProgress(progressId, 4);
        
        logger.info(`Classifying batch of ${emailsToSave.length} emails for user ${userId}`);
        await AIService.classifyUserEmails(userId, {
          emailIds: emailsToSave.map(e => e.id),
          batchSize: 20 // Process in smaller batches for AI classification
        });
      }
      
    } while (nextPageToken && totalProcessed < batchSize);
    
    // Final progress update
    await ProgressService.completeProgress(progressId);
    
    logger.info(`Successfully processed email-sync job for user: ${userId}. Total emails: ${totalProcessed}`);
    done();
  } catch (error) {
    logger.error(`Job failed for user ${userId}:`, { error })
    if (progressId) {
      await ProgressService.updateProgress(progressId, -1); // Mark as failed
    }
    done(error as Error)
  }
})

emailSyncQueue.on('completed', (job: Job<{ userId: string }>) => {
  logger.info(`Job ${job.id} completed successfully for user ${job.data.userId}.`)
})

emailSyncQueue.on('failed', (job: Job<{ userId: string }> | undefined, err: Error) => {
  const jobId = job?.id || 'unknown';
  const userId = job?.data?.userId || 'unknown';
  logger.error(`Job ${jobId} failed for user ${userId} with error: ${err.message}`);
})

console.log('Worker is listening for jobs...')
