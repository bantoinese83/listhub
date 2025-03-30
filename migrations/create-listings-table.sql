-- Drop the listings table if it exists
DROP TABLE IF EXISTS listings CASCADE;

-- Create listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    category_id UUID NOT NULL,
    subcategory_id UUID,
    user_id UUID NOT NULL,
    location_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    views INTEGER DEFAULT 0,
    contact_info TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    price_reduced BOOLEAN DEFAULT false,
    price_reduction_percentage INTEGER,
    original_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX listings_user_id_idx ON listings(user_id);

-- Create index on category_id for faster lookups
CREATE INDEX listings_category_id_idx ON listings(category_id);

-- Create index on location_id for faster lookups
CREATE INDEX listings_location_id_idx ON listings(location_id);

-- Create index on status for faster filtering
CREATE INDEX listings_status_idx ON listings(status);

-- Create index on created_at for faster sorting
CREATE INDEX listings_created_at_idx ON listings(created_at DESC);

-- Create index on price for faster price-based filtering and sorting
CREATE INDEX listings_price_idx ON listings(price);

-- Create index on is_featured for faster featured listings queries
CREATE INDEX listings_is_featured_idx ON listings(is_featured);

-- Create index on tags for faster tag-based filtering
CREATE INDEX listings_tags_idx ON listings USING GIN (tags);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 