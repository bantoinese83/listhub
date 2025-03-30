-- Drop the user_verifications table if it exists
DROP TABLE IF EXISTS user_verifications CASCADE;

-- Create user_verifications table
CREATE TABLE user_verifications (
    user_id UUID PRIMARY KEY,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified BOOLEAN DEFAULT false,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key constraint
ALTER TABLE user_verifications
ADD CONSTRAINT user_verifications_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_user_verifications_updated_at
    BEFORE UPDATE ON user_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 