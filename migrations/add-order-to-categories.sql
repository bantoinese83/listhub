-- Add order column to categories table
ALTER TABLE categories ADD COLUMN "order" INTEGER DEFAULT 0;

-- Update existing categories with order values
UPDATE categories SET "order" = 1 WHERE parent_id IS NULL;
UPDATE categories SET "order" = 2 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'marketplace');
UPDATE categories SET "order" = 3 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'housing');
UPDATE categories SET "order" = 4 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'jobs-gigs');
UPDATE categories SET "order" = 5 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'services');
UPDATE categories SET "order" = 6 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'community');
UPDATE categories SET "order" = 7 WHERE parent_id = (SELECT id FROM categories WHERE slug = 'discussions'); 