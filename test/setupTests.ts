// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.OPENAI_API_KEY = 'mock-openai-api-key';

// Import the mock Supabase from our test utilities
import { mockSupabase } from './test-utils/mockSupabase';

// Mock the supabase module
jest.mock('../backend/src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock console methods to keep test output clean
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
