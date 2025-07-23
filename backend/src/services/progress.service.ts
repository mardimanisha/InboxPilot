import { createLogger } from '../utils/logger'
import { supabase } from '../lib/supabase'

const logger = createLogger('ProgressService')

export class ProgressService {
  static async createProgress(userId: string, jobId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          job_id: jobId,
          status: 'in_progress',
          current_step: 0,
          total_steps: 3,
          created_at: new Date()
        })
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to create progress:', { error, userId, jobId });
        throw new Error(`Failed to create progress for user ${userId}, job ${jobId}: ${error.message || JSON.stringify(error)}`);
      }
      if (!data) {
        logger.error('No data returned when creating progress', { userId, jobId });
        throw new Error('No data returned from Supabase when creating progress');
      }
      return data.id;
    } catch (error) {
      logger.error('Unexpected error creating progress:', { error })
      throw error
    }
  }

  static async updateProgress(progressId: string, currentStep: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('progress')
        .update({
          current_step: currentStep,
          updated_at: new Date()
        })
        .eq('id', progressId);

      if (error) {
        logger.error('Failed to update progress:', { error, progressId, currentStep });
        throw new Error(`Failed to update progress ${progressId} to step ${currentStep}: ${error.message || JSON.stringify(error)}`);
      }
    } catch (error) {
      logger.error('Unexpected error updating progress:', { error })
      throw error
    }
  }

  static async completeProgress(progressId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('progress')
        .update({
          status: 'completed',
          completed_at: new Date()
        })
        .eq('id', progressId)

      if (error) {
        logger.error('Failed to complete progress:', { error })
        throw error
      }
    } catch (error) {
      logger.error('Unexpected error completing progress:', { error })
      throw error
    }
  }

  static async getProgress(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .single()

      if (error) {
        logger.error('Failed to get progress:', { error })
        throw error
      }

      return data
    } catch (error) {
      logger.error('Unexpected error getting progress:', { error })
      throw error
    }
  }
}
