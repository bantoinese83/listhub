-- Drop the listing_images table if it exists
DROP TABLE IF EXISTS listing_images CASCADE;

-- Create listing_images table
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    url TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on listing_id for faster lookups
CREATE INDEX listing_images_listing_id_idx ON listing_images(listing_id);

-- Create index on position for faster sorting
CREATE INDEX listing_images_position_idx ON listing_images(position);

-- Add foreign key constraint
ALTER TABLE listing_images
ADD CONSTRAINT listing_images_listing_id_fkey
FOREIGN KEY (listing_id)
REFERENCES listings(id)
ON DELETE CASCADE; 