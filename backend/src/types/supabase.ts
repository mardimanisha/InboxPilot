import { Database } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      emails: {
        Row: {
          id: string;
          user_id: string;
          gmail_id: string;
          thread_id: string;
          from: string;
          to: string;
          subject: string;
          body: string;
          date: string;
          processed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gmail_id: string;
          thread_id: string;
          from: string;
          to: string;
          subject: string;
          body: string;
          date: string;
          processed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gmail_id?: string;
          thread_id?: string;
          from?: string;
          to?: string;
          subject?: string;
          body?: string;
          date?: string;
          processed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      email_classifications: {
        Row: {
          id: string;
          email_id: string;
          user_id: string;
          category: string;
          confidence: number;
          reason: string;
          processed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email_id: string;
          user_id: string;
          category: string;
          confidence: number;
          reason: string;
          processed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email_id?: string;
          user_id?: string;
          category?: string;
          confidence?: number;
          reason?: string;
          processed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
