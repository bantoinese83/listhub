-- Drop the id_verifications table if it exists
DROP TABLE IF EXISTS id_verifications CASCADE;

-- Create id_verifications table
CREATE TABLE id_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    id_type TEXT NOT NULL CHECK (id_type IN ('passport', 'drivers_license', 'national_id')),
    id_number TEXT NOT NULL,
    id_image_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    reviewer_id UUID,
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX id_verifications_user_id_idx ON id_verifications(user_id);
CREATE INDEX id_verifications_status_idx ON id_verifications(status);
CREATE INDEX id_verifications_reviewer_id_idx ON id_verifications(reviewer_id);

-- Add foreign key constraints
ALTER TABLE id_verifications
ADD CONSTRAINT id_verifications_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE id_verifications
ADD CONSTRAINT id_verifications_reviewer_id_fkey
FOREIGN KEY (reviewer_id)
REFERENCES profiles(id)
ON DELETE SET NULL;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_id_verifications_updated_at
    BEFORE UPDATE ON id_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 