export interface OnboardingProgress {
  stepName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progressPercentage: number;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  metadata: Record<string, unknown>;
}

export interface OnboardingProgressResponse {
  progress: OnboardingProgress[];
  overallProgress: number;
  completed: boolean;
}
