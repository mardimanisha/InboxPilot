import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      // Redirect to onboarding after successful authentication
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } catch (error) {
      console.error('Unexpected error during code exchange:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
  }
  
  // If no code is present, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
