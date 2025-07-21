import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createLogger } from '../utils/logger'

const logger = createLogger('SecurityMiddleware')

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100

const rateLimitCache = new Map<string, number>()

function getIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
}

function incrementRateLimit(ip: string): boolean {
  const now = Date.now()
  const count = rateLimitCache.get(ip) || 0
  
  // Reset counter if window has expired
  if (count > 0 && now - count > RATE_LIMIT_WINDOW) {
    rateLimitCache.set(ip, 1)
    return true
  }
  
  // Increment counter
  const newCount = (count || 0) + 1
  rateLimitCache.set(ip, newCount)
  
  return newCount <= MAX_REQUESTS_PER_WINDOW
}

export async function securityMiddleware(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIp(request)
    if (!incrementRateLimit(ip)) {
      logger.warn('Rate limit exceeded', { ip })
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Security headers
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', 'default-src self;')

    // CSRF protection
    const csrfToken = request.cookies.get('csrf_token')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (request.method === 'POST' && (!csrfToken || csrfToken !== csrfHeader)) {
      logger.warn('CSRF token validation failed', { ip })
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    return response
  } catch (error) {
    logger.error('Security middleware error:', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
}