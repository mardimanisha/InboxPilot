import { NextResponse } from 'next/server'
import { AuthService } from '../../services/auth'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(new URL(`/auth/error?error=${encodeURIComponent(error)}`, process.env.NEXT_PUBLIC_URL))
    }

    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(new URL('/auth/error?error=no_code', process.env.NEXT_PUBLIC_URL))
    }

    // Exchange the code for a session and persist tokens
    const result = await AuthService.exchangeCodeForSession(code)

    if ('message' in result) {
      console.error('Failed to exchange code for session:', result.message)
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(result.message)}`, process.env.NEXT_PUBLIC_URL)
      )
    }

    // Get the user's session to ensure it's set
    const sessionResult = await AuthService.getSession()
    
    if ('message' in sessionResult) {
      console.error('Failed to get session after code exchange:', sessionResult.message)
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(sessionResult.message)}`, process.env.NEXT_PUBLIC_URL)
      )
    }

    // Redirect to onboarding page after successful authentication
    return NextResponse.redirect(new URL('/onboarding', process.env.NEXT_PUBLIC_URL))
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent('unexpected_error')}`, process.env.NEXT_PUBLIC_URL)
    )
  }
}