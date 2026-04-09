-- Profiles table for users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  level TEXT,
  avatar_url TEXT,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property photos table for provenance tracking
CREATE TABLE property_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  meta_data JSONB,
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
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Allow public read for now, authenticated write)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Properties are viewable by everyone." ON properties FOR SELECT USING (true);
CREATE POLICY "Hosts can manage their own properties." ON properties FOR ALL USING (auth.uid() = host_id);

CREATE POLICY "Photos are viewable by everyone." ON property_photos FOR SELECT USING (true);
CREATE POLICY "Hosts can manage property photos." ON property_photos FOR ALL USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_photos.property_id 
    AND properties.host_id = auth.uid()
  )
);
