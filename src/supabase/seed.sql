-- Clear existing data
TRUNCATE TABLE property_reviews CASCADE;
TRUNCATE TABLE property_photos CASCADE;
TRUNCATE TABLE properties CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Seed users into profiles
INSERT INTO profiles (id, name, level, avatar_url, trust_score, verified)
VALUES 
  ('11111111-1111-4111-a111-111111111111', 'Vikram Sharma', 'Trust Elite Level 4', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 98, true),
  ('22222222-2222-4222-a222-222222222222', 'Sarah Chen', 'Trust Pro Level 3', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 95, true),
  ('33333333-3333-4333-a333-333333333333', 'Elena Rodriguez', 'Trust Guardian', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', 99, true);

-- Seed Properties
-- 1. Design (Jogiwala)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('a1111111-1111-4111-a111-111111111111', 'Eco-Luxe Geometric Cabin', 'Jogiwala, Dehradun', 4500, 'An architectural marvel in the heart of Jogiwala, Dehradun.', 'https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200', 4.98, true, 'Design');

INSERT INTO property_photos (property_id, url, is_verified, meta_data)
VALUES ('a1111111-1111-4111-a111-111111111111', 'https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200', true, '{"sourceDevice": "Capture One Pro · Secure Enclave", "timestamp": "March 15, 2026", "gps": "30.2984° N, 78.0772° E"}');

-- 2. Amazing views (Mussoorie Road)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('b2222222-2222-4222-a222-222222222222', 'Himalayan Glass House', 'Mussoorie Road, Dehradun', 12000, 'Panoramic views of the Doon valley.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', 5.0, true, 'Amazing views');

INSERT INTO property_photos (property_id, url, is_verified, meta_data)
VALUES ('b2222222-2222-4222-a222-222222222222', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', true, '{"sourceDevice": "Sony A7RV", "timestamp": "March 20, 2026"}');

-- 3. Icons (Rajpur Road)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('c3333333-3333-4333-a333-333333333333', 'The Concrete Monolith', 'Rajpur Road, Dehradun', 8500, 'Brutalist architecture in a lush green setting.', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200', 4.85, true, 'Icons');

INSERT INTO property_photos (property_id, url, is_verified)
VALUES ('c3333333-3333-4333-a333-333333333333', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200', true);

-- 4. Amazing pools (Sahastradhara)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('d4444444-4444-4444-a444-444444444444', 'Infinity Valley Retreat', 'Sahastradhara, Dehradun', 6500, 'An infinity pool overlooking the river valley.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200', 4.9, true, 'Amazing pools');

INSERT INTO property_photos (property_id, url, is_verified)
VALUES ('d4444444-4444-4444-a444-444444444444', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200', true);

-- 6. Tiny homes (Jogiwala)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('f6666666-6666-6666-a666-666666666666', 'Minimalist Dehradun Cube', 'Jogiwala, Dehradun', 3200, 'Smart living in a tiny footprint.', 'https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200', 4.7, true, 'Tiny homes');

INSERT INTO property_photos (property_id, url, is_verified)
VALUES ('f6666666-6666-6666-a666-666666666666', 'https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200', true);

-- 7. A-frames (Near Dehradun)
INSERT INTO properties (id, title, location, price, description, image_url, rating, verified, category)
VALUES ('21111111-1111-4111-a111-111111111111', 'Pine Ridge A-Frame', 'Near Dehradun', 4800, 'Cozy A-frame cabin in a pine forest.', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200', 4.95, true, 'A-frames');

INSERT INTO property_photos (property_id, url, is_verified)
VALUES ('21111111-1111-4111-a111-111111111111', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200', true);

-- Seed some reviews for the first property
INSERT INTO property_reviews (property_id, user_name, rating, comment, date, is_verified, avatar_url)
VALUES 
  ('a1111111-1111-4111-a111-111111111111', 'Vikram Sharma', 5, 'Perfect stay in Dehradun.', 'October 2025', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150');
