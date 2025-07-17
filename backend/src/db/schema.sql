-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  thread_id TEXT,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  date TIMESTAMP WITH TIME ZONE,
  labels TEXT[],
  importance TEXT CHECK (importance IN ('high', 'normal', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email_id)
);

-- Email classifications table
CREATE TABLE IF NOT EXISTS email_classifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  category TEXT CHECK (category IN ('urgent', 'action_needed', 'fyi', 'ignore')) NOT NULL,
  confidence DECIMAL(4,3) CHECK (confidence >= 0 AND confidence <= 1),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, email_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date);
CREATE INDEX IF NOT EXISTS idx_email_classifications_user_id ON email_classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_classifications_category ON email_classifications(category);

-- Create RLS policies
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_classifications ENABLE ROW LEVEL SECURITY;

-- Emails RLS policies
CREATE POLICY "Users can view their own emails" ON emails
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails" ON emails
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails" ON emails
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Email classifications RLS policies
CREATE POLICY "Users can view their own email classifications" ON email_classifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email classifications" ON email_classifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email classifications" ON email_classifications
  FOR UPDATE
  USING (auth.uid() = user_id);
