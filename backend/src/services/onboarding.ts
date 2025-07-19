import { createLogger } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { User } from '../types/auth'

const logger = createLogger('OnboardingService')

export interface OnboardingStep {
  name: string
  title: string
  description: string
}

export interface OnboardingProgress {
  stepName: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progressPercentage: number
  startedAt: string
  completedAt?: string
  errorMessage?: string
  metadata?: Record<string, any>
}

export class OnboardingService {
  private static instance: OnboardingService

  private constructor() {}

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService()
    }
    return OnboardingService.instance
  }

  public async initializeOnboarding(userId: string): Promise<void> {
    try {
      const steps = this.getOnboardingSteps()
      
      // Initialize all steps as pending
      for (const step of steps) {
        const { error } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: userId,
            step_name: step.name,
            status: 'pending',
            progress_percentage: 0
          })
          .select()

        if (error) throw error
      }
    } catch (error) {
      logger.error('Error initializing onboarding', { userId, error })
      throw error
    }
  }

  public async updateProgress(
    userId: string,
    stepName: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
    progressPercentage: number,
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          status,
          progress_percentage: progressPercentage,
          error_message: errorMessage,
          metadata,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('step_name', stepName)

      if (error) throw error
    } catch (error) {
      logger.error('Error updating onboarding progress', { userId, stepName, error })
      throw error
    }
  }

  public async getProgress(userId: string): Promise<OnboardingProgress[]> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .order('step_name')

      if (error) throw error
      
      return data.map(item => ({
        stepName: item.step_name,
        status: item.status as 'pending' | 'in_progress' | 'completed' | 'failed',
        progressPercentage: item.progress_percentage,
        startedAt: item.started_at,
        completedAt: item.completed_at,
        errorMessage: item.error_message,
        metadata: item.metadata
      }))
    } catch (error) {
      logger.error('Error getting onboarding progress', { userId, error })
      throw error
    }
  }

  private getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        name: 'connect_email',
        title: 'Connecting to Gmail',
        description: 'Establishing secure connection...'
      },
      {
        name: 'scan_inbox',
        title: 'Scanning your inbox',
        description: 'Analyzing your last 100 emails...'
      },
      {
        name: 'setup_dashboard',
        title: 'Setting up your dashboard',
        description: 'Preparing your personalized experience...'
      }
    ]
  }
}
