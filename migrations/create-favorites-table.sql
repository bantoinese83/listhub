-- Drop the favorites table if it exists
DROP TABLE IF EXISTS favorites CASCADE;

-- Create favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX favorites_user_id_idx ON favorites(user_id);

-- Create index on listing_id for faster lookups
CREATE INDEX favorites_listing_id_idx ON favorites(listing_id);

-- Add foreign key constraints
ALTER TABLE favorites
ADD CONSTRAINT favorites_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE favorites
ADD CONSTRAINT favorites_listing_id_fkey
FOREIGN KEY (listing_id)
REFERENCES listings(id)
ON DELETE CASCADE; 