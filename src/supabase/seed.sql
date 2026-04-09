-- Seed users into profiles
INSERT INTO profiles (id, name, level, avatar_url, trust_score, verified)
VALUES 
  ('11111111-1111-4111-a111-111111111111', 'Vikram Sharma', 'Trust Elite Level 4', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 98, true),
  ('22222222-2222-4222-a222-222222222222', 'Sarah Chen', 'Trust Pro Level 3', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 95, true),
  ('33333333-3333-4333-a333-333333333333', 'Elena Rodriguez', 'Trust Guardian', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', 99, true),
  ('44444444-4444-4444-a444-444444444444', 'Marcus Wright', 'Pending Verification', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', 42, false)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  avatar_url = EXCLUDED.avatar_url,
  trust_score = EXCLUDED.trust_score,
  verified = EXCLUDED.verified;

-- Seed properties
-- 1. Eco-Luxe Geometric Cabin
WITH cabin_id AS (
  INSERT INTO properties (id, title, location, price, description, image_url, rating, reviews_count, verified_reviews_count, verified, allow_unverified_guests, category)
  VALUES ('a1111111-1111-4111-a111-111111111111', 'Eco-Luxe Geometric Cabin', 'Yucca Valley, California', 450, 'A architectural marvel nestled in the high desert, this geometric cabin offers panoramic mountain views and refined minimalist interiors.', 'https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200', 4.98, 124, 118, true, false, 'Design')
  RETURNING id
)
INSERT INTO property_photos (property_id, url, is_verified, meta_data)
SELECT id, 'https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200', true, '{"sourceDevice": "Capture One Pro · Secure Enclave", "timestamp": "March 15, 2026", "gps": "34.1161° N, 116.4258° W"}' FROM cabin_id;

-- 2. Floating Glass Villa
WITH villa_id AS (
  INSERT INTO properties (id, title, location, price, description, image_url, rating, reviews_count, verified_reviews_count, verified, allow_unverified_guests, category)
  VALUES ('b2222222-2222-4222-a222-222222222222', 'Floating Glass Villa', 'Malibu, California', 1200, 'Suspended over the Pacific, this glass villa provides an immersive oceanic experience with floor-to-ceiling windows.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', 5.0, 48, 48, true, false, 'Icons')
  RETURNING id
)
INSERT INTO property_photos (property_id, url, is_verified, meta_data)
SELECT id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', true, '{"sourceDevice": "Sony A7RV · CAI", "timestamp": "March 20, 2026", "gps": "34.0259° N"}' FROM villa_id;

-- 3. The Invisible House
WITH invisible_id AS (
  INSERT INTO properties (id, title, location, price, description, image_url, rating, reviews_count, verified_reviews_count, verified, allow_unverified_guests, category)
  VALUES ('c3333333-3333-4333-a333-333333333333', 'The Invisible House', 'Joshua Tree, California', 3500, 'A 5,500 sq ft mirror-cladding home that reflects its stunning surroundings while offering unparalleled luxury.', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200', 4.95, 89, 12, false, true, 'Amazing views')
  RETURNING id
)
INSERT INTO property_photos (property_id, url, is_verified)
SELECT id, 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200', false FROM invisible_id;

-- Seed some reviews
INSERT INTO property_reviews (property_id, user_name, rating, comment, date, is_verified, avatar_url)
VALUES 
  ('a1111111-1111-4111-a111-111111111111', 'Vikram Sharma', 5, 'The perspective of the mountains from the geometric living area is life-changing. Everything in the photos matches the reality exactly.', 'October 2025', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'),
  ('a1111111-1111-4111-a111-111111111111', 'Sarah Chen', 5, 'Clean, quiet, and absolutely stunning. The digital provenance tech gave me so much peace of mind before booking.', 'December 2025', true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150'),
  ('b2222222-2222-4222-a222-222222222222', 'Elena Rodriguez', 5, 'Absolute luxury. Seeing the ''Live Enclave'' badge made me confident that the pool view wasn''t a Photoshop trick.', 'January 2026', true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150');
