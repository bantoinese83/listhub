-- Check if listings table exists before proceeding
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'listings') THEN
        RAISE EXCEPTION 'listings table does not exist. Please run create-listings-table.sql first.';
    END IF;
END $$;

-- Drop existing foreign key constraints if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listings_user_id_fkey') THEN
        ALTER TABLE listings DROP CONSTRAINT listings_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listings_category_id_fkey') THEN
        ALTER TABLE listings DROP CONSTRAINT listings_category_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listings_subcategory_id_fkey') THEN
        ALTER TABLE listings DROP CONSTRAINT listings_subcategory_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listings_location_id_fkey') THEN
        ALTER TABLE listings DROP CONSTRAINT listings_location_id_fkey;
    END IF;
END $$;

-- Add foreign key constraints for listings table
ALTER TABLE listings
ADD CONSTRAINT listings_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE listings
ADD CONSTRAINT listings_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;

ALTER TABLE listings
ADD CONSTRAINT listings_subcategory_id_fkey
FOREIGN KEY (subcategory_id)
REFERENCES categories(id)
ON DELETE SET NULL;

ALTER TABLE listings
ADD CONSTRAINT listings_location_id_fkey
FOREIGN KEY (location_id)
REFERENCES locations(id)
ON DELETE CASCADE; 