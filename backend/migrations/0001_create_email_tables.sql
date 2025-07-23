-- Create emails table to store raw email data
CREATE TABLE public.emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    gmail_message_id TEXT NOT NULL UNIQUE,
    thread_id TEXT NOT NULL,
    subject TEXT,
    from_address TEXT,
    to_address TEXT,
    cc_address TEXT,
    bcc_address TEXT,
    date TIMESTAMP WITH TIME ZONE,
    snippet TEXT,
    body TEXT,
    labels TEXT[],
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT false,
    is_spam BOOLEAN DEFAULT false,
    is_trash BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gmail_message_id)
);

-- Create email attachments table
CREATE TABLE public.email_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES public.emails ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    attachment_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email classifications table
CREATE TABLE public.email_classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES public.emails ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    classification_type TEXT NOT NULL,
    classification_score FLOAT NOT NULL,
    classification_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email_id, classification_type)
);

-- Create update functions
CREATE OR REPLACE FUNCTION public.update_email_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.update_email_updated_at();

-- Create indexes for performance
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_emails_date ON public.emails(date);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX idx_email_classifications_email_id ON public.email_classifications(email_id);
CREATE INDEX idx_email_classifications_classification_type ON public.email_classifications(classification_type);

-- Enable RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_classifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Emails
CREATE POLICY "Users can view their own emails"
    ON public.emails
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails"
    ON public.emails
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails"
    ON public.emails
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Email Attachments
CREATE POLICY "Users can view their own email attachments"
    ON public.email_attachments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.emails 
            WHERE emails.id = email_attachments.email_id 
            AND emails.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own email attachments"
    ON public.email_attachments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.emails 
            WHERE emails.id = email_attachments.email_id 
            AND emails.user_id = auth.uid()
        )
    );

-- Email Classifications
CREATE POLICY "Users can view their own email classifications"
    ON public.email_classifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email classifications"
    ON public.email_classifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.emails TO authenticated;
GRANT ALL ON public.email_attachments TO authenticated;
GRANT ALL ON public.email_classifications TO authenticated;
