import { NextResponse } from 'next/server'
import { AuthService } from '../../services/auth'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(new URL('/auth/error', process.env.NEXT_PUBLIC_URL))
    }

    // Exchange the code for a session and persist tokens
    const result = await AuthService.exchangeCodeForSession(code)

    if ('message' in result) {
      return NextResponse.redirect(new URL(`/auth/error?error=${result.message}`, process.env.NEXT_PUBLIC_URL))
    }

    // Redirect to onboarding page after successful authentication
    return NextResponse.redirect(new URL('/onboarding', process.env.NEXT_PUBLIC_URL))
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/error', process.env.NEXT_PUBLIC_URL))
  }
}