import { Session } from '@supabase/supabase-js';

export interface SessionData {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function createSessionCookie({
  value,
  isSession = false,
}: {
  value: SessionData;
  isSession?: boolean;
}): Promise<string> {
  // TODO: Implement actual session cookie creation
  return JSON.stringify(value);
}

export function getSessionData(session: Session | null): SessionData | null {
  if (!session) return null;
  return {
    userId: session.user?.id || '',
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at || 0,
  };
}