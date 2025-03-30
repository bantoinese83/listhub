-- Add verification fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS identity_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_verification_check timestamp with time zone;

-- Create phone verifications table
CREATE TABLE IF NOT EXISTS phone_verifications (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number text NOT NULL,
    verification_code text NOT NULL,
    verified_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create identity verifications table
CREATE TABLE IF NOT EXISTS identity_verifications (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending',
    verification_type text NOT NULL,
    document_type text,
    document_number text,
    verified_at timestamp with time zone,
    expires_at timestamp with time zone,
    verification_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create RLS policies
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_verifications ENABLE ROW LEVEL SECURITY;

-- Phone verifications policies
CREATE POLICY "Users can view their own phone verifications"
    ON phone_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own phone verifications"
    ON phone_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phone verifications"
    ON phone_verifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Identity verifications policies
CREATE POLICY "Users can view their own identity verifications"
    ON identity_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own identity verifications"
    ON identity_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own identity verifications"
    ON identity_verifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Create functions for verification
CREATE OR REPLACE FUNCTION check_user_verification()
RETURNS trigger AS $$
BEGIN
    -- Update is_verified based on all verification checks
    NEW.is_verified := 
        NEW.email_verified AND 
        NEW.phone_verified AND 
        NEW.identity_verified;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update verification status
CREATE TRIGGER update_verification_status
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_user_verification(); 