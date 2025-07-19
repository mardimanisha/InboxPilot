import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { OnboardingService, OnboardingProgress } from '../services/onboarding'

const logger = createLogger('OnboardingProgressAPI')

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const onboardingService = OnboardingService.getInstance()
    const progress: OnboardingProgress[] = await onboardingService.getProgress(session.user.id)

    // Calculate overall progress
    const totalSteps = progress.length
    const completedSteps = progress.filter(step => step.status === 'completed').length
    const overallProgress = Math.round((completedSteps / totalSteps) * 100)

    return NextResponse.json({
      progress,
      overallProgress,
      completed: completedSteps === totalSteps
    })
  } catch (error) {
    logger.error('Error getting onboarding progress', { error })
    return NextResponse.json(
      { error: 'Failed to get onboarding progress' },
      { status: 500 }
    )
  }
}
