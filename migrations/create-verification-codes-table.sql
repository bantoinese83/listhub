-- Drop the verification_codes table if it exists
DROP TABLE IF EXISTS verification_codes CASCADE;

-- Create verification_codes table
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'phone')),
    code TEXT NOT NULL,
    target TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX verification_codes_user_id_idx ON verification_codes(user_id);
CREATE INDEX verification_codes_type_idx ON verification_codes(type);
CREATE INDEX verification_codes_code_idx ON verification_codes(code);
CREATE INDEX verification_codes_expires_at_idx ON verification_codes(expires_at);

-- Add foreign key constraint
ALTER TABLE verification_codes
ADD CONSTRAINT verification_codes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE; 