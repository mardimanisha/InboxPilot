import { NextResponse } from 'next/server'
import { AuthService } from '../../services/auth'

export async function GET(request: Request) {
  try {
    const result = await AuthService.getSession()

    if ('message' in result) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status }
      )
    }

    const { user } = result
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    )
  }
}