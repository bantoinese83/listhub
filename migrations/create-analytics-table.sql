-- Drop the analytics table if it exists
DROP TABLE IF EXISTS analytics CASCADE;

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    user_id UUID NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'message', 'favorite', 'share')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX analytics_listing_id_idx ON analytics(listing_id);
CREATE INDEX analytics_user_id_idx ON analytics(user_id);
CREATE INDEX analytics_event_type_idx ON analytics(event_type);
CREATE INDEX analytics_created_at_idx ON analytics(created_at);

-- Add foreign key constraints
ALTER TABLE analytics
ADD CONSTRAINT analytics_listing_id_fkey
FOREIGN KEY (listing_id)
REFERENCES listings(id)
ON DELETE CASCADE;

ALTER TABLE analytics
ADD CONSTRAINT analytics_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE; 