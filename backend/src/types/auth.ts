import { Session, User as SupabaseUser } from '@supabase/auth-js'

export interface User extends Omit<SupabaseUser, 'user_metadata'> {
  google_id?: string
}

export interface AuthResponse {
  user: User | null
  session: Session
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: AuthError | null
}