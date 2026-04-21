-- Profiles table for users
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  level TEXT,
  avatar_url TEXT,
  trust_score INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  allow_unverified_guests BOOLEAN DEFAULT TRUE,
  min_trust_score INTEGER DEFAULT 75,
  category TEXT,
  reviews_count INTEGER DEFAULT 0,
  verified_reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property photos table for provenance tracking
CREATE TABLE property_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_ai BOOLEAN DEFAULT FALSE,
  meta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property reviews table
CREATE TABLE property_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  date TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Allow public read for now, authenticated write)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Properties are viewable by everyone." ON properties FOR SELECT USING (true);
CREATE POLICY "Photos are viewable by everyone." ON property_photos FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone." ON property_reviews FOR SELECT USING (true);

-- Simplified policies for demo/seeding (allow all for now)
CREATE POLICY "Allow everything for everyone for demo" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow everything for everyone for demo" ON properties FOR ALL USING (true);
CREATE POLICY "Allow everything for everyone for demo" ON property_photos FOR ALL USING (true);
CREATE POLICY "Allow everything for everyone for demo" ON property_reviews FOR ALL USING (true);
CREATE POLICY "Allow everything for everyone for demo" ON bookings FOR ALL USING (true);
