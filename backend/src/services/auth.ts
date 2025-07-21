import { supabase } from '../lib/supabase'
import { AuthError, AuthResponse, User } from '../types/auth'
import { createLogger } from '../utils/logger'

const logger = createLogger('AuthService')

export class AuthService {
  static async signInWithGoogle(): Promise<{ url: string } | AuthError> {
    try {
      logger.info('Initiating Google OAuth flow')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      
      if (error) {
        logger.error('Google OAuth error:', { error })
        return {
          message: error.message,
          status: error.status
        }
      }

      logger.info('Successfully initiated Google OAuth flow')
      return data
    } catch (error) {
      logger.error('Unexpected error in Google OAuth flow:', { error })
      return {
        message: 'Failed to sign in with Google',
        status: 500
      }
    }
  }

  static async getSession(): Promise<AuthResponse | AuthError> {
    try {
      logger.info('Fetching session')
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        logger.error('Session fetch error:', { error })
        return {
          message: error.message,
          status: error.status
        }
      }

      if (!data?.session) {
        logger.info('No session found')
        return {
          message: 'No session found',
          status: 401
        }
      }

      const user = data.session.user as User
      logger.info('Successfully retrieved session', { userId: user.id })
      
      return {
        user,
        session: data.session
      }
    } catch (error) {
      logger.error('Unexpected error in session fetch:', { error })
      return {
        message: 'Failed to get session',
        status: 500
      }
    }
  }

  static async signOut(): Promise<boolean> {
    try {
      logger.info('Initiating sign out')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logger.error('Sign out error:', { error })
        return false
      }

      logger.info('Successfully signed out')
      return true
    } catch (error) {
      logger.error('Unexpected error in sign out:', { error })
      return false
    }
  }

  static async refreshSession(): Promise<AuthResponse | AuthError> {
    try {
      logger.info('Refreshing session')
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        logger.error('Session refresh error:', { error })
        return {
          message: error.message,
          status: error.status
        }
      }

      if (!data.session) {
        logger.warn('No session found during refresh')
        return {
          message: 'No session found',
          status: 401
        }
      }

      const user = data.session.user as User
      logger.info('Successfully refreshed session', { userId: user.id })
      
      return {
        user,
        session: data.session!
      }
    } catch (error) {
      logger.error('Unexpected error in session refresh:', { error })
      return {
        message: 'Failed to refresh session',
        status: 500
      }
    }
  }
}