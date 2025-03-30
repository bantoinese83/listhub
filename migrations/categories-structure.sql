-- First, clear existing categories if needed
DELETE FROM categories;

-- Reset the sequence
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Insert top-level categories
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
-- 1. Marketplace
('Marketplace', 'marketplace', NULL, 'Buy and sell goods locally', 1),
-- 2. Housing
('Housing', 'housing', NULL, 'Find a place to live', 2),
-- 3. Jobs & Gigs
('Jobs & Gigs', 'jobs-gigs', NULL, 'Find work or hire help', 3),
-- 4. Services
('Services', 'services', NULL, 'Find or offer services', 4),
-- 5. Community
('Community', 'community', NULL, 'Local connections and activities', 5),
-- 6. Discussions
('Discussions', 'discussions', NULL, 'Forums and conversations', 6);

-- Insert subcategories for Marketplace
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
-- Vehicles
('Vehicles', 'vehicles', 1, 'Cars, motorcycles, boats, and more', 1),
('Cars & Trucks', 'cars-trucks', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Cars, trucks, and SUVs', 1),
('Motorcycles', 'motorcycles', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Motorcycles and scooters', 2),
('RVs & Campers', 'rvs-campers', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Recreational vehicles and campers', 3),
('Boats', 'boats', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Boats and watercraft', 4),
('Powersports', 'powersports', (SELECT id FROM categories WHERE slug = 'vehicles'), 'ATVs, UTVs, snowmobiles', 5),
('Trailers', 'trailers', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Utility and travel trailers', 6),
('Aviation', 'aviation', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Aircraft and aviation equipment', 7),
('Auto Parts', 'auto-parts', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Car and truck parts', 8),
('Wheels & Tires', 'wheels-tires', (SELECT id FROM categories WHERE slug = 'vehicles'), 'Wheels, tires, and accessories', 9),

-- Electronics
('Electronics', 'electronics', 1, 'Computers, phones, and more', 2),
('Computers & Parts', 'computers-parts', (SELECT id FROM categories WHERE slug = 'electronics'), 'Computers, laptops, and components', 1),
('Phones & Accessories', 'phones-accessories', (SELECT id FROM categories WHERE slug = 'electronics'), 'Mobile phones and accessories', 2),
('Photo & Video', 'photo-video', (SELECT id FROM categories WHERE slug = 'electronics'), 'Cameras and video equipment', 3),
('Video Gaming', 'video-gaming', (SELECT id FROM categories WHERE slug = 'electronics'), 'Consoles, games, and accessories', 4),
('Audio/Visual', 'audio-visual', (SELECT id FROM categories WHERE slug = 'electronics'), 'TVs, stereos, and home audio', 5),
('General Electronics', 'general-electronics', (SELECT id FROM categories WHERE slug = 'electronics'), 'Other electronics', 6),

-- Home & Garden
('Home & Garden', 'home-garden', 1, 'Furniture, appliances, and more', 3),
('Furniture', 'furniture', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Sofas, tables, beds, and more', 1),
('Appliances', 'appliances', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Kitchen and home appliances', 2),
('Household Items', 'household-items', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Decor, kitchenware, and more', 3),
('Farm & Garden', 'farm-garden', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Plants, equipment, and supplies', 4),
('Tools', 'tools', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Power tools and hand tools', 5),
('Materials', 'materials', (SELECT id FROM categories WHERE slug = 'home-garden'), 'Building and crafting materials', 6),

-- Clothing, Health & Beauty
('Clothing, Health & Beauty', 'clothing-health-beauty', 1, 'Clothing, accessories, and more', 4),
('Clothing & Accessories', 'clothing-accessories', (SELECT id FROM categories WHERE slug = 'clothing-health-beauty'), 'Clothes, shoes, and accessories', 1),
('Jewelry', 'jewelry', (SELECT id FROM categories WHERE slug = 'clothing-health-beauty'), 'Jewelry and watches', 2),
('Health & Beauty Items', 'health-beauty-items', (SELECT id FROM categories WHERE slug = 'clothing-health-beauty'), 'Health and beauty products', 3),
('Baby & Kid Gear', 'baby-kid-gear', (SELECT id FROM categories WHERE slug = 'clothing-health-beauty'), 'Baby and children\'s items', 4),

-- Hobbies & Recreation
('Hobbies & Recreation', 'hobbies-recreation', 1, 'Sports, music, and more', 5),
('Bikes & Parts', 'bikes-parts', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Bicycles and components', 1),
('Sporting Goods', 'sporting-goods', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Sports equipment and gear', 2),
('Musical Instruments', 'musical-instruments', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Instruments and equipment', 3),
('Arts & Crafts Supplies', 'arts-crafts-supplies', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Art and craft materials', 4),
('Books, Movies, Music', 'books-movies-music', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Books, DVDs, CDs, and records', 5),
('Toys & Games', 'toys-games', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Toys, board games, and puzzles', 6),
('Tickets', 'tickets', (SELECT id FROM categories WHERE slug = 'hobbies-recreation'), 'Event tickets', 7),

-- Collectibles & Business
('Collectibles & Business', 'collectibles-business', 1, 'Antiques, collectibles, and business equipment', 6),
('Antiques', 'antiques', (SELECT id FROM categories WHERE slug = 'collectibles-business'), 'Antique furniture and items', 1),
('Collectibles', 'collectibles', (SELECT id FROM categories WHERE slug = 'collectibles-business'), 'Collectible items', 2),
('Business/Commercial Goods', 'business-commercial-goods', (SELECT id FROM categories WHERE slug = 'collectibles-business'), 'Business equipment and supplies', 3),
('Heavy Equipment', 'heavy-equipment', (SELECT id FROM categories WHERE slug = 'collectibles-business'), 'Construction and industrial equipment', 4),

-- Other
('Other', 'other', 1, 'Free items, barter, and more', 7),
('Free Items', 'free-items', (SELECT id FROM categories WHERE slug = 'other'), 'Items available for free', 1),
('Barter / Swap', 'barter-swap', (SELECT id FROM categories WHERE slug = 'other'), 'Trade items or services', 2),
('Garage Sales', 'garage-sales', (SELECT id FROM categories WHERE slug = 'other'), 'Yard sales and estate sales', 3),
('General For Sale', 'general-for-sale', (SELECT id FROM categories WHERE slug = 'other'), 'Miscellaneous items for sale', 4),
('Wanted', 'wanted', (SELECT id FROM categories WHERE slug = 'other'), 'Items wanted to buy', 5);

-- Insert subcategories for Housing
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
-- Rentals
('Rentals', 'rentals', 2, 'Apartments, houses, and rooms for rent', 1),
('Apartments / Housing for Rent', 'apartments-housing-for-rent', (SELECT id FROM categories WHERE slug = 'rentals'), 'Apartments and houses for rent', 1),
('Rooms / Shared Living', 'rooms-shared-living', (SELECT id FROM categories WHERE slug = 'rentals'), 'Rooms and shared accommodations', 2),
('Sublets / Temporary Housing', 'sublets-temporary-housing', (SELECT id FROM categories WHERE slug = 'rentals'), 'Short-term rentals and sublets', 3),
('Vacation Rentals', 'vacation-rentals', (SELECT id FROM categories WHERE slug = 'rentals'), 'Vacation properties for rent', 4),

-- For Sale
('For Sale', 'for-sale', 2, 'Homes and land for sale', 2),
('Real Estate for Sale', 'real-estate-for-sale', (SELECT id FROM categories WHERE slug = 'for-sale'), 'Homes and land for sale', 1),

-- Other Housing
('Other Housing', 'other-housing', 2, 'Housing wanted, commercial space, and more', 3),
('Housing Wanted', 'housing-wanted', (SELECT id FROM categories WHERE slug = 'other-housing'), 'Looking for housing', 1),
('Housing Swap', 'housing-swap', (SELECT id FROM categories WHERE slug = 'other-housing'), 'Exchange housing arrangements', 2),
('Office / Commercial Space', 'office-commercial-space', (SELECT id FROM categories WHERE slug = 'other-housing'), 'Office and retail space', 3),
('Parking / Storage', 'parking-storage', (SELECT id FROM categories WHERE slug = 'other-housing'), 'Parking spaces and storage units', 4);

-- Insert subcategories for Jobs & Gigs
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
-- Full-Time / Part-Time Jobs
('Full-Time / Part-Time Jobs', 'full-time-part-time', 3, 'Career opportunities and employment', 1),
('Accounting & Finance', 'accounting-finance', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Accounting and finance jobs', 1),
('Admin / Office / Customer Service', 'admin-office-customer-service', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Administrative and customer service jobs', 2),
('Art / Media / Design / Writing', 'art-media-design-writing', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Creative and media jobs', 3),
('Business / Management / HR', 'business-management-hr', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Business and management jobs', 4),
('Education / Nonprofit', 'education-nonprofit', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Education and nonprofit jobs', 5),
('Engineering / Architecture', 'engineering-architecture', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Engineering and architecture jobs', 6),
('Food / Hospitality', 'food-hospitality', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Food service and hospitality jobs', 7),
('General Labor / Skilled Trades / Manufacturing', 'general-labor-skilled-trades-manufacturing', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Labor, trades, and manufacturing jobs', 8),
('Government / Legal', 'government-legal', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Government and legal jobs', 9),
('Healthcare / Biotech / Science', 'healthcare-biotech-science', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Healthcare and science jobs', 10),
('Marketing / PR / Sales', 'marketing-pr-sales', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Marketing and sales jobs', 11),
('Retail / Wholesale', 'retail-wholesale', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Retail and wholesale jobs', 12),
('Salon / Spa / Fitness', 'salon-spa-fitness', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Beauty and fitness jobs', 13),
('Security / Transport', 'security-transport', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Security and transportation jobs', 14),
('Technical', 'technical', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'IT and technical jobs', 15),
('TV / Film / Video', 'tv-film-video', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'TV, film, and video production jobs', 16),
('Other Fields', 'other-fields', (SELECT id FROM categories WHERE slug = 'full-time-part-time'), 'Other job categories', 17),

-- Short-Term Gigs
('Short-Term Gigs', 'short-term-gigs', 3, 'Temporary and freelance work', 2),
('Computer / Tech Gigs', 'computer-tech-gigs', (SELECT id FROM categories WHERE slug = 'short-term-gigs'), 'Computer and tech gigs', 1),
('Creative Gigs', 'creative-gigs', (SELECT id FROM categories WHERE slug = 'short-term-gigs'), 'Writing, photo, design, and talent gigs', 2),
('Labor Gigs', 'labor-gigs', (SELECT id FROM categories WHERE slug = 'short-term-gigs'), 'Moving, cleaning, and general labor gigs', 3),
('Event Gigs', 'event-gigs', (SELECT id FROM categories WHERE slug = 'short-term-gigs'), 'Event staffing and services', 4),
('Domestic / Care Gigs', 'domestic-care-gigs', (SELECT id FROM categories WHERE slug = 'short-term-gigs'), 'Domestic and care work', 5),

-- Seeking Work / Resumes
('Seeking Work / Resumes', 'seeking-work', 3, 'Job seekers posting their availability', 3);

-- Insert subcategories for Services
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
-- Home & Auto
('Home & Auto', 'home-auto', 4, 'Home improvement and automotive services', 1),
('Automotive Repair & Services', 'automotive-repair-services', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Car and truck repair services', 1),
('Cycle Repair & Services', 'cycle-repair-services', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Bicycle and motorcycle repair', 2),
('Marine Services', 'marine-services', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Boat and watercraft services', 3),
('Skilled Trades', 'skilled-trades', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Plumbing, electrical, and other trades', 4),
('Household Services', 'household-services', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Cleaning, handyman, and home services', 5),
('Moving & Labor', 'moving-labor', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Moving and general labor services', 6),
('Farm & Garden Services', 'farm-garden-services', (SELECT id FROM categories WHERE slug = 'home-auto'), 'Landscaping and garden services', 7),

-- Personal & Wellness
('Personal & Wellness', 'personal-wellness', 4, 'Health, beauty, and personal services', 2),
('Beauty Services', 'beauty-services', (SELECT id FROM categories WHERE slug = 'personal-wellness'), 'Hair, nails, and beauty services', 1),
('Health & Wellness', 'health-wellness', (SELECT id FROM categories WHERE slug = 'personal-wellness'), 'Therapy, fitness, and wellness services', 2),
('Lessons & Tutoring', 'lessons-tutoring', (SELECT id FROM categories WHERE slug = 'personal-wellness'), 'Educational and skill instruction', 3),
('Pet Services', 'pet-services', (SELECT id FROM categories WHERE slug = 'personal-wellness'), 'Pet sitting, grooming, and walking', 4),
('Childcare', 'childcare', (SELECT id FROM categories WHERE slug = 'personal-wellness'), 'Babysitting and childcare services', 5),

-- Business & Creative
('Business & Creative', 'business-creative', 4, 'Professional and creative services', 3),
('Computer & Tech Support', 'computer-tech-support', (SELECT id FROM categories WHERE slug = 'business-creative'), 'IT and technical support', 1),
('Creative Services', 'creative-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Design, writing, and photography services', 2),
('Event Services', 'event-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Planning, DJ, and catering services', 3),
('Financial Services', 'financial-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Accounting and financial services', 4),
('Legal Services', 'legal-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Legal advice and services', 5),
('Real Estate Services', 'real-estate-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Real estate agents and services', 6),
('Small Business Advertising', 'small-business-advertising', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Marketing and advertising services', 7),
('Writing / Editing / Translation', 'writing-editing-translation', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Writing and language services', 8),
('Travel / Vacation Services', 'travel-vacation-services', (SELECT id FROM categories WHERE slug = 'business-creative'), 'Travel planning and services', 9);

-- Insert subcategories for Community
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
('Activities & Events', 'activities-events', 5, 'Local activities and events', 1),
('Groups & Clubs', 'groups-clubs', 5, 'Local groups and clubs', 2),
('Artists & Musicians', 'artists-musicians', 5, 'Seeking collaboration and connection', 3),
('Volunteers Needed', 'volunteers-needed', 5, 'Volunteer opportunities', 4),
('Local News & Issues', 'local-news-issues', 5, 'Community news and discussions', 5),
('Lost & Found', 'lost-found', 5, 'Lost and found items and pets', 6),
('Missed Connections', 'missed-connections', 5, 'Reconnect with someone you met', 7),
('Pets', 'pets', 5, 'Pet adoption and rehoming', 8),
('Rideshare / Carpooling', 'rideshare-carpooling', 5, 'Shared transportation', 9),
('General Community', 'general-community', 5, 'General community announcements', 10);

-- Insert subcategories for Discussions
INSERT INTO categories (name, slug, parent_id, description, "order") VALUES
('Interests & Hobbies', 'interests-hobbies', 6, 'Discuss hobbies and interests', 1),
('Life & Society', 'life-society', 6, 'Discuss life and social issues', 2),
('Support & Advice', 'support-advice', 6, 'Get support and advice', 3);

