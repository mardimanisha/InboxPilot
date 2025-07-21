import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Password authentication is not supported. Please use Google OAuth.' },
    { status: 400 }
  )
}