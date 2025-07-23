// Import the mock Supabase from our test utilities
import { mockSupabase } from './test-utils/mockSupabase';

// Extend the global namespace to include our mock
declare global {
  // eslint-disable-next-line no-var
  var mockSupabase: typeof mockSupabase;
}

// Make the mock available globally
(global as any).mockSupabase = mockSupabase;

// Mock the supabase module
jest.mock('../backend/src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.OPENAI_API_KEY = 'mock-openai-api-key';

// Mock console methods to keep test output clean
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
