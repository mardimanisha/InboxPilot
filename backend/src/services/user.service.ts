import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';

const logger = createLogger('UserService');

export class UserService {
  static async getUserTokens(userId: string): Promise<{
    access_token: string | null;
    refresh_token: string | null;
    expires_in?: number;
    token_type?: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user tokens:', { error, userId });
        throw new Error(`Error fetching user tokens for user ${userId}: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when fetching user tokens', { userId });
        return null;
      }
      return data;
    } catch (error) {
      logger.error('Failed to get user tokens:', error);
      return null;
    }
  }

  static async updateUserTokens(
    userId: string,
    tokens: {
      access_token: string;
      refresh_token: string;
      expires_in?: number;
      token_type?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: userId,
          ...tokens,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        logger.error('Error updating user tokens:', { error, userId, tokens });
        throw new Error(`Error updating user tokens for user ${userId}: ${error.message || JSON.stringify(error)}`);
      }
    } catch (error) {
      logger.error('Failed to update user tokens:', error);
      throw error;
    }
  }
}

export default new UserService();
