import OpenAI from 'openai';
import { config } from '../config';
import { EmailClassification } from '../types/gmail';
import { createLogger } from '../utils/logger';

const logger = createLogger('OpenAIService');

export class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async classifyEmail(emailContent: string): Promise<EmailClassification> {
    try {
      const prompt = `Classify this email as urgent, action_needed, fyi, or ignore. 
      Provide a confidence score between 0 and 1. 
      Explain your reasoning.
      
      Email: ${emailContent}
      
      Response format:
      {
        category: "urgent" | "action_needed" | "fyi" | "ignore",
        confidence: number,
        reason: string
      }`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      
      const classification = JSON.parse(content);
      return {
        id: crypto.randomUUID(),
        category: classification.category,
        confidence: classification.confidence,
        reason: classification.reason
      };
    } catch (error) {
      logger.error('Error classifying email', { error });
      throw error;
    }
  }

  public async batchClassifyEmails(emails: string[]): Promise<EmailClassification[]> {
    const classifications: EmailClassification[] = [];
    
    for (const email of emails) {
      const classification = await this.classifyEmail(email);
      classifications.push(classification);
    }

    return classifications;
  }
}
