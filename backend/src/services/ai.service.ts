import { createLogger } from '../utils/logger';
import type { 
  EmailClassificationResponse,
  EmailClassification,
  ClassificationResult
} from '../types/ai';
import { EmailService } from './email.service';
import { Email } from '../types/email';
import OpenAI from 'openai';
import { env } from '../config/environment';
import { supabase } from '../lib/supabase';

const logger = createLogger('AIService');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Email priority levels
type PriorityLevel = 'high' | 'medium' | 'low';

// Email categories
type EmailCategory = 'URGENT' | 'ACTION_REQUIRED' | 'FOLLOW_UP' | 'REFERENCE' | 'PROMOTIONAL' | 'SOCIAL' | 'SPAM';

// Category descriptions for the AI
const CATEGORY_DESCRIPTIONS: Record<EmailCategory, string> = {
  URGENT: 'Requires immediate attention (e.g., time-sensitive requests, critical issues)',
  ACTION_REQUIRED: 'Needs a response or action (e.g., questions, requests, tasks)',
  FOLLOW_UP: 'Follow-up required (e.g., waiting for response, pending actions)',
  REFERENCE: 'For reference only (e.g., newsletters, updates, notifications)',
  PROMOTIONAL: 'Promotional content (e.g., marketing, sales, offers)',
  SOCIAL: 'Social updates (e.g., social media, personal updates)',
  SPAM: 'Unwanted or unsolicited emails'
};

// Priority level descriptions
const PRIORITY_LEVELS: Record<PriorityLevel, string> = {
  high: 'Requires immediate attention',
  medium: 'Important but not urgent',
  low: 'Can be addressed later'
};

export class AIService {
  /**
   * Classify a single email using AI
   */
  static async classifyEmail(email: Email): Promise<EmailClassificationResponse> {
    try {
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(email);

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      return this.parseAIResponse(email.id, content);
    } catch (error) {
      logger.error('AI classification failed, falling back to basic classification', { error });
      return this.basicClassifyEmail(email);
    }
  }

  /**
   * Classify multiple emails in batches
   */
  static async classifyUserEmails(
    userId: string,
    options: { emailIds?: string[]; batchSize?: number } = {}
  ): Promise<ClassificationResult[]> {
    const { emailIds, batchSize = 20 } = options;
    const results: ClassificationResult[] = [];
    
    try {
      // Get emails that need classification
      const emails = await EmailService.getUserEmails(userId, {
        limit: batchSize,
        // Filter by emailIds if provided, otherwise get all unclassified
        ...(emailIds && emailIds.length > 0 && { 
          // We'll need to filter the results manually since the API doesn't support filtering by multiple IDs
        })
      });
      
      // Filter by emailIds if provided
      const filteredEmails = emailIds && emailIds.length > 0 
        ? emails.filter(email => emailIds.includes(email.id))
        : emails;

      if (filteredEmails.length === 0) {
        logger.info('No emails to classify');
        return [];
      }

      logger.info(`Classifying ${filteredEmails.length} emails for user ${userId}`);
      
      // Process emails in parallel with a concurrency limit
      const BATCH_CONCURRENCY = 5;
      for (let i = 0; i < filteredEmails.length; i += BATCH_CONCURRENCY) {
        const batch = filteredEmails.slice(i, i + BATCH_CONCURRENCY);
        const batchPromises = batch.map(email => this.classifyEmail(email));
        const batchResults = await Promise.all(batchPromises);
        
        // Save classifications to database
        const classifications = batchResults.map(result => this.createClassification(result, userId));
        await this.saveClassifications(classifications);
        
        // Map EmailClassificationResponse to ClassificationResult
        const mappedResults = batchResults.map(result => ({
          emailId: result.emailId,
          classificationType: result.classificationType,
          classificationScore: result.score,
          classificationData: {
            priority: result.priority,
            category: result.category,
            reasoning: result.reasoning,
            suggestedActions: result.suggestedActions
          },
          priority: result.priority,
          category: result.category,
          score: result.score,
          reasoning: result.reasoning,
          suggestedActions: result.suggestedActions
        }));
        
        results.push(...mappedResults);
      }

      logger.info(`Successfully classified ${results.length} emails for user ${userId}`);
      return results;
    } catch (error) {
      logger.error(`Failed to classify emails for user ${userId}:`, { error });
      throw error;
    }
  }

  /**
   * Create a classification record for database storage
   */
  private static createClassification(
    result: EmailClassificationResponse,
    userId: string
  ): Omit<EmailClassification, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      emailId: result.emailId,
      userId,
      classificationType: 'priority',
      classificationScore: result.score,
      classificationData: {
        priority: result.priority,
        category: result.category,
        reasoning: result.reasoning,
        suggestedActions: result.suggestedActions
      }
    };
  }

  /**
   * Save classifications to the database
   */
  private static async saveClassifications(
    classifications: Omit<EmailClassification, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<void> {
    if (classifications.length === 0) return;
    
    try {
      const { error, data } = await supabase
        .from('email_classifications')
        .insert(classifications);
      
      if (error) {
        logger.error('Failed to save email classifications', { error, classifications });
        throw new Error(`Failed to save email classifications: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when saving email classifications', { classifications });
        throw new Error('No data returned from Supabase when saving email classifications');
      }
    } catch (error) {
      logger.error('Failed to save email classifications', { error, classifications });
      throw error;
    }
  }

  /**
   * Create a system prompt for the AI
   */
  private static createSystemPrompt(): string {
    const categories = Object.entries(CATEGORY_DESCRIPTIONS)
      .map(([category, description]) => `- ${category}: ${description}`)
      .join('\n');

    const priorities = Object.entries(PRIORITY_LEVELS)
      .map(([level, description]) => `- ${level}: ${description}`)
      .join('\n');

    return `You are an AI email assistant that helps users manage their inbox by classifying emails.
      
      Available categories:
      ${categories}
      
      Priority levels:
      ${priorities}
      
      For each email, provide:
      1. Category: The most appropriate category from the list above
      2. Priority: The priority level (high, medium, low)
      3. Reasoning: A brief explanation of your classification
      4. Suggested Actions: 1-3 actions the user might want to take
      
      Format your response like this:
      Category: [CATEGORY]
      Priority: [PRIORITY]
      Reasoning: [YOUR_REASONING]
      Suggested Actions:
      - [ACTION 1]
      - [ACTION 2]`;
  }

  /**
   * Create a user prompt for the AI
   */
  private static createUserPrompt(email: Email): string {
    return `Subject: ${email.subject || '(No subject)'}
      \nFrom: ${email.fromAddress || 'Unknown sender'}
      \nTo: ${email.toAddress || 'Unknown recipient'}
      \nDate: ${email.date?.toISOString() || 'Unknown date'}
      \nLabels: ${email.labels?.join(', ') || 'None'}
      \n\n${email.body?.substring(0, 2000) || '(No body content)'}`;
  }

  /**
   * Parse the AI response into a structured format
   */
  private static parseAIResponse(
    emailId: string,
    content: string
  ): EmailClassificationResponse {
    // Default values
    let category: EmailCategory = 'REFERENCE';
    let priority: PriorityLevel = 'low';
    let reasoning = 'Unable to determine classification';
    let suggestedActions: string[] = ['Review email content'];
    
    // Parse the response
    const categoryMatch = content.match(/Category:\s*([A-Z_]+)/i);
    const priorityMatch = content.match(/Priority:\s*([a-z]+)/i);
    const reasoningMatch = content.match(/Reasoning:([\s\S]*?)(?=\n\w+:|$)/i);
    const actionsMatch = content.match(/Suggested Actions:([\s\S]*?)(?=\n\w+:|$)/i);

    // Set category if valid
    if (categoryMatch && Object.keys(CATEGORY_DESCRIPTIONS).includes(categoryMatch[1].toUpperCase())) {
      category = categoryMatch[1].toUpperCase() as EmailCategory;
    }

    // Set priority if valid
    if (priorityMatch && ['high', 'medium', 'low'].includes(priorityMatch[1].toLowerCase())) {
      priority = priorityMatch[1].toLowerCase() as PriorityLevel;
    }

    // Set reasoning if found
    if (reasoningMatch) {
      reasoning = reasoningMatch[1].trim();
    }

    // Set suggested actions if found
    if (actionsMatch) {
      suggestedActions = actionsMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean);
    }

    // Calculate confidence score
    const score = this.calculateConfidenceScore(content);

    return {
      emailId,
      classificationType: 'priority',
      category,
      priority,
      reasoning,
      suggestedActions,
      score
    };
  }

  /**
   * Basic classification as fallback when AI fails
   */
  private static basicClassifyEmail(email: Email): EmailClassificationResponse {
    const subject = (email.subject || '').toLowerCase();
    const body = (email.body || '').toLowerCase();
    const sender = (email.fromAddress || '').toLowerCase();
    
    // Default classification
    let category: EmailCategory = 'REFERENCE';
    let priority: PriorityLevel = 'low';
    let reasoning = 'Basic classification based on keywords';
    let suggestedActions = ['Review when you have time'];
    
    // Check for urgent emails
    if (subject.includes('urgent') || body.includes('urgent') || subject.includes('asap')) {
      category = 'URGENT';
      priority = 'high';
      reasoning = 'Email contains urgent keywords';
      suggestedActions = ['Respond as soon as possible', 'Mark as done when complete'];
    } 
    // Check for action required
    else if (subject.includes('action required') || body.includes('please respond') || 
             body.includes('let me know') || body.includes('need your input')) {
      category = 'ACTION_REQUIRED';
      priority = 'medium';
      reasoning = 'Email requires a response or action';
      suggestedActions = ['Respond within 24 hours', 'Add to task list if needed'];
    }
    // Check for follow-ups
    else if (subject.includes('follow up') || body.includes('follow up') || 
             subject.includes('following up') || body.includes('following up')) {
      category = 'FOLLOW_UP';
      priority = 'medium';
      reasoning = 'Email is a follow-up to a previous conversation';
      suggestedActions = ['Check previous conversation', 'Respond with update'];
    }
    // Check for promotions
    else if (sender.includes('newsletter') || sender.includes('promo') || 
             subject.includes('sale') || subject.includes('discount') ||
             subject.includes('offer') || body.includes('unsubscribe')) {
      category = 'PROMOTIONAL';
      priority = 'low';
      reasoning = 'Email appears to be promotional';
      suggestedActions = ['Unsubscribe if not interested', 'Move to promotions folder'];
    }
    // Check for social updates
    else if (sender.includes('linkedin') || sender.includes('twitter') || 
             sender.includes('facebook') || sender.includes('instagram') ||
             sender.includes('social') || subject.includes('connection')) {
      category = 'SOCIAL';
      priority = 'low';
      reasoning = 'Email is a social media notification';
      suggestedActions = ['Review when you have free time'];
    }
    // Check for spam
    else if (email.labels?.includes('SPAM') || email.labels?.includes('JUNK') ||
             subject.includes('viagra') || subject.includes('lottery') ||
             subject.includes('$$$') || body.includes('$$$')) {
      category = 'SPAM';
      priority = 'low';
      reasoning = 'Email appears to be spam';
      suggestedActions = ['Mark as spam', 'Delete'];
    }

    return {
      emailId: email.id,
      classificationType: 'priority',
      category,
      priority,
      reasoning,
      suggestedActions,
      score: 0.7 // Lower confidence for basic classification
    };
  }

  /**
   * Calculate confidence score based on AI response quality
   */
  private static calculateConfidenceScore(content: string): number {
    // Simple heuristic: count the number of required sections
    const requiredSections = ['Category', 'Priority', 'Reasoning', 'Suggested Actions'];
    const presentSections = requiredSections.filter(section => 
      content.includes(`${section}:`)
    ).length;
    
    // Base score on percentage of sections present
    const baseScore = presentSections / requiredSections.length;
    
    // Adjust score based on response length (longer responses often have more detail)
    const lengthScore = Math.min(1, content.length / 100);
    
    // Weighted average favoring base score
    return (baseScore * 0.7) + (lengthScore * 0.3);
  }
}
