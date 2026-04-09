import { supabase } from './supabase';

console.log("🚀 HavenSafe Version: v1.5.0-forensic-fix");

// Helper to sync with localStorage for demo persistence
const getStoredProperties = () => {
  try {
    const stored = localStorage.getItem('havenSafeProperties');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored properties:", e);
    // If corrupted, clear it to prevent further crashes
    localStorage.removeItem('havenSafeProperties');
  }
  return null;
};

export const updatePropertyInStore = async (updatedProperty) => {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('properties')
      .upsert({
        id: updatedProperty.id.length > 20 ? updatedProperty.id : undefined, // only use if it looks like a valid UUID
        title: updatedProperty.title,
        location: updatedProperty.location,
        price: parseFloat(updatedProperty.price),
        rating: updatedProperty.rating || 5.0,
        reviews_count: updatedProperty.reviewsCount || 0,
        verified_reviews_count: updatedProperty.verifiedReviewsCount || 0,
        verified: updatedProperty.verified,
        allow_unverified_guests: updatedProperty.allowUnverifiedGuests ?? true,
        category: updatedProperty.category || 'Design',
        image_url: updatedProperty.image,
        description: updatedProperty.description
      })
      .select();
    
    if (error) {
       console.error("Supabase upsert error detail:", error);
       throw error;
    }

    // Attempt to seed photo metadata if it exists
    if (updatedProperty.photos && data?.[0]?.id) {
       // First, delete old photos to prevent duplicates if we're re-syncing
       await supabase.from('property_photos').delete().eq('property_id', data[0].id);
       
       const photoInserts = updatedProperty.photos.map(ph => ({
         property_id: data[0].id,
         url: ph.url,
         is_verified: ph.isVerified,
         meta_data: ph.meta
       }));
       await supabase.from('property_photos').insert(photoInserts);
    }

    // Attempt to persist reviews if they exist
    if (updatedProperty.reviews && data?.[0]?.id) {
       // Delete existing to allow a clean sync (Standard and simplified for demo)
       await supabase.from('property_reviews').delete().eq('property_id', data[0].id);

       const reviewInserts = updatedProperty.reviews.map(rev => ({
         property_id: data[0].id,
         user_name: rev.user,
         rating: rev.rating,
         comment: rev.comment,
         date: rev.date,
         is_verified: rev.verified,
         avatar_url: rev.avatar
       }));
       await supabase.from('property_reviews').insert(reviewInserts);
    }
  } catch (err) {
    console.warn("Supabase update failed, falling back to localStorage:", err);
    
    const current = getStoredProperties() || initialProperties;
    const exists = current.some(p => p.id === updatedProperty.id);
    
    // Safety check: Only sanitize if the total dataset exceeds LocalStorage limits (approx 5MB)
    // We allow large forensic images to persist as they are critical for the demo.
    const sanitizedProperty = { ...updatedProperty };

    const updated = exists 
      ? current.map(p => p.id === updatedProperty.id ? sanitizedProperty : p)
      : [...current, sanitizedProperty];
      
    try {
      localStorage.setItem('havenSafeProperties', JSON.stringify(updated));
    } catch (storageErr) {
      console.warn("⚠️ LocalStorage full, skipping fallback save.");
    }
  }
  
  // Signal updates to other components
  window.dispatchEvent(new Event('storage-update'));
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const initialProperties = [
  {
    id: "1",
    title: "Eco-Luxe Geometric Cabin",
    location: "Yucca Valley, California",
    distance: "12 miles away",
    price: 450,
    rating: 4.98,
    reviewsCount: 124,
    verifiedReviewsCount: 118,
    verified: true,
    allowUnverifiedGuests: false,
    category: "Design",
    image: "https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Capture One Pro · Secure Enclave", timestamp: "March 15, 2026", gps: "34.1161\u00b0 N, 116.4258\u00b0 W" } },
      { id: "p2", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Capture One Pro", timestamp: "March 15, 2026", gps: "34.1162\u00b0 N" } },
      { id: "p3", url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200", isVerified: false }
    ],
    host: { name: "Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
    description: "A architectural marvel nestled in the high desert, this geometric cabin offers panoramic mountain views and refined minimalist interiors.",
    reviews: [
      { id: "r1", user: "Vikram Sharma", rating: 5, date: "October 2025", comment: "The perspective of the mountains from the geometric living area is life-changing. Everything in the photos matches the reality exactly.", verified: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" },
      { id: "r2", user: "Sarah Chen", rating: 5, date: "December 2025", comment: "Clean, quiet, and absolutely stunning. The digital provenance tech gave me so much peace of mind before booking.", verified: true, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150" },
      { id: "r3", user: "John Doe", rating: 4, date: "August 2025", comment: "Cool place, but a bit far from the main road.", verified: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150" }
    ]
  },
  {
    id: "2",
    title: "Floating Glass Villa",
    location: "Malibu, California",
    distance: "2,450 miles away",
    price: 1200,
    rating: 5.0,
    reviewsCount: 48,
    verifiedReviewsCount: 48,
    verified: true,
    allowUnverifiedGuests: false,
    category: "Icons",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Sony A7RV \u00b7 CAI", timestamp: "March 20, 2026", gps: "34.0259\u00b0 N" } },
      { id: "p2", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200", isVerified: true },
      { id: "p3", url: "https://images.unsplash.com/photo-1600607687989-e7247571a650?q=80&w=1200", isVerified: false }
    ],
    host: { name: "Elena", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
    description: "Suspended over the Pacific, this glass villa provides an immersive oceanic experience with floor-to-ceiling windows.",
    reviews: [
      { id: "r4", user: "Elena Rodriguez", rating: 5, date: "January 2026", comment: "Absolute luxury. Seeing the 'Live Enclave' badge made me confident that the pool view wasn't a Photoshop trick. It was even better in person!", verified: true, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150" },
      { id: "r5", user: "Anonymous Trip", rating: 3, date: "November 2025", comment: "Great place, but the Wi-Fi was spotty.", verified: false, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150" }
    ]
  },
  {
    id: "3",
    title: "The Invisible House",
    location: "Joshua Tree, California",
    distance: "45 miles away",
    price: 3500,
    rating: 4.95,
    reviewsCount: 89,
    verifiedReviewsCount: 12,
    verified: false,
    allowUnverifiedGuests: true,
    category: "Amazing views",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200", isVerified: false },
      { id: "p2", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200", isVerified: false }
    ],
    host: { name: "Marcus", superhost: false, joined: "2020", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    description: "A 5,500 sq ft mirror-cladding home that reflects its stunning surroundings while offering unparalleled luxury.",
    reviews: [
      { id: "r6", user: "Adventurer Sam", rating: 5, date: "July 2025", comment: "Mind-blowing architecture. A bit expensive but worth it for the photos alone.", verified: false, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150" },
      { id: "r7", user: "Trust First", rating: 4, date: "September 2025", comment: "Host was slow to respond, but the place is exactly as pictured.", verified: false, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150" }
    ]
  },
  {
    id: "f1",
    title: "Mountain Hideaway",
    location: "Aspen, Colorado",
    distance: "850 miles away",
    price: 890,
    rating: 4.95,
    reviewsCount: 312,
    verifiedReviewsCount: 280,
    verified: true,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Sony A7R IV" } }],
    host: { name: "Erik", superhost: true, joined: "2019", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" },
    description: "A luxury hideaway in the heart of Aspen, offering world-class views and absolute privacy.",
    reviews: [{ id: "rf1", user: "Verified Guest", rating: 5, date: "Feb 2026", comment: "The mountain view is exactly as seen in the verified photo.", verified: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150" }]
  },
  {
    id: "f2",
    title: "Modernist Retreat",
    location: "Austin, Texas",
    distance: "1,200 miles away",
    price: 320,
    rating: 4.88,
    verified: false,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200", isVerified: false }],
    host: { name: "Sarah", superhost: false, joined: "2021", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
    description: "Sleek, modern, and perfectly located in Austin's trendiest neighborhood.",
    reviews: []
  },
  {
    id: "f3",
    title: "Nordic Cabin",
    location: "Lofoten, Norway",
    distance: "4,500 miles away",
    price: 550,
    rating: 5.0,
    verified: true,
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Phase One XF" } }],
    host: { name: "Lars", superhost: true, joined: "2017", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200" },
    description: "Experience the Aurora from this handcrafted Nordic cabin perched over a fjord.",
    reviews: []
  },
  {
    id: "f4",
    title: "Zen Sanctuary",
    location: "Kyoto, Japan",
    distance: "6,200 miles away",
    price: 720,
    rating: 4.97,
    verified: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200", isVerified: true }],
    host: { name: "Yuki", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
    description: "A tranquil sanctuary in the hills of Kyoto.",
    reviews: []
  },
  {
    id: "f5",
    title: "Desert Oasis",
    location: "Palm Springs, California",
    distance: "105 miles away",
    price: 410,
    rating: 4.92,
    verified: true,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200", isVerified: true }],
    host: { name: "Mark", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    description: "Classic Palm Springs luxury.",
    reviews: []
  },
  {
    id: "f6",
    title: "Architectural Cube",
    location: "Berlin, Germany",
    distance: "5,100 miles away",
    price: 280,
    rating: 4.85,
    verified: true,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200", isVerified: true }],
    host: { name: "Dieter", superhost: true, joined: "2016", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
    description: "Modernist cube in the city center.",
    reviews: []
  },
  {
    id: "f7",
    title: "Lakeside Minimalist",
    location: "Lake Como, Italy",
    distance: "5,800 miles away",
    price: 1500,
    rating: 4.99,
    verified: true,
    image: "https://images.unsplash.com/photo-1512918766671-ad6507962077?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1512918766671-ad6507962077?q=80&w=1200", isVerified: true }],
    host: { name: "Giulia", superhost: true, joined: "2014", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
    description: "Unparalleled luxury on Lake Como.",
    reviews: []
  },
  {
    id: "f8",
    title: "Concrete Loft",
    location: "London, UK",
    distance: "4,900 miles away",
    price: 450,
    rating: 4.91,
    verified: true,
    image: "https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200", isVerified: true }],
    host: { name: "James", superhost: false, joined: "2020", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" },
    description: "Brutalist beauty in East London.",
    reviews: []
  }
];

export const getProperties = async () => {
  try {
    // 1. Fetch properties (Fast, flat query)
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) {
      console.error("❌ Supabase Properties Error:", error);
      throw error;
    }
    
    if (properties && properties.length > 0) {
      console.log(`🟢 SUPABASE CONNECTED: Fetched ${properties.length} properties (Lightweight).`);
      
      // 3. Map snake_case to camelCase
      // 4. Also fetch photos for these properties to show verified badges on home page
      const { data: allPhotos } = await supabase.from('property_photos').select('*');
      
      return properties.map(p => {
        const propPhotos = allPhotos?.filter(ph => ph.property_id === p.id) || [];
        return {
          id: p.id,
          title: p.title,
          location: p.location,
          price: p.price,
          rating: p.rating,
          reviewsCount: p.reviews_count,
          verifiedReviewsCount: p.verified_reviews_count,
          verified: p.verified,
          allowUnverifiedGuests: p.allow_unverified_guests,
          category: p.category,
          image: p.image_url,
          description: p.description,
          host: p.host || { name: " Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
          photos: propPhotos.map(ph => ({
            id: ph.id,
            url: ph.url,
            isVerified: ph.is_verified,
            meta: ph.meta_data || ph.metadata
          })),
          reviews: [] // Reviews still deferred for detail page
        };
      });
    }
  } catch (err) {
    console.warn("Supabase lightweight fetch failed, falling back to mock data:", err);
  }

  const stored = getStoredProperties();
  const baseData = Array.isArray(stored) ? stored : initialProperties;
  return baseData;
};

// NEW FUNCTION: Fetch full details only when a single property is clicked
export const getPropertyById = async (id) => {
  try {
    const [propRes, photosRes, reviewsRes] = await Promise.all([
      supabase.from('properties').select('*').eq('id', id).single(),
      supabase.from('property_photos').select('*').eq('property_id', id),
      supabase.from('property_reviews').select('*').eq('property_id', id)
    ]);

    if (propRes.error) throw propRes.error;

    const p = propRes.data;
    const propertyPhotos = photosRes.data || [];
    const propertyReviews = reviewsRes.data || [];

    return {
      id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        rating: p.rating,
        reviewsCount: p.reviews_count,
        verifiedReviewsCount: p.verified_reviews_count,
        verified: p.verified,
        allowUnverifiedGuests: p.allow_unverified_guests,
        category: p.category,
        image: p.image_url,
      description: p.description,
      host: p.host || { name: " Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
      photos: propertyPhotos.map(ph => ({
         id: ph.id,
         url: ph.url,
         isVerified: ph.is_verified,
         meta: ph.meta_data || ph.metadata
      })),
      reviews: propertyReviews.map(r => ({
         id: r.id,
         user: r.user_name || r.user,
         rating: r.rating,
         date: r.date,
         comment: r.comment,
         verified: r.is_verified ?? r.verified,
         avatar: r.avatar_url || r.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
      }))
    };
  } catch (err) {
    console.warn("Supabase getPropertyById failed, using local data", err);
    const properties = await getProperties();
    const mockProperty = properties.find(p => p.id === id) || initialProperties[0];
    const initial = initialProperties.find(ip => ip.id === mockProperty.id);
    return {
      ...mockProperty,
      photos: mockProperty.photos?.length ? mockProperty.photos : initial?.photos || [],
      reviews: mockProperty.reviews?.length ? mockProperty.reviews : initial?.reviews || []
    };
  }
};

// Kept for static access in some components, but should use getProperties()
export const properties = initialProperties;

export const categories = [
  { id: "all", name: "All", icon: "Globe" },
  { id: "icons", name: "Icons", icon: "Stars" },
  { id: "amazing-views", name: "Amazing views", icon: "Mountain" },
  { id: "design", name: "Design", icon: "Palmtree" },
  { id: "amazing-pools", name: "Amazing pools", icon: "Waves" },
  { id: "castles", name: "Castles", icon: "Castle" },
  { id: "tiny-homes", name: "Tiny homes", icon: "Home" },
  { id: "a-frames", name: "A-frames", icon: "Triangle" }
];

export const getVerifiedUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar_url,
        verified: u.verified,
        trustScore: u.trust_score,
        level: u.level
      }));
    }
  } catch (err) {
    console.warn("Supabase profiles fetch failed:", err);
  }
  return mockVerifiedUsers;
};

export const mockVerifiedUsers = [
  { 
    id: "hs_9210", 
    name: "Vikram Sharma", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    verified: true,
    trustScore: 98,
    level: "Trust Elite Level 4"
  },
  { 
    id: "hs_4432", 
    name: "Sarah Chen", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    verified: true,
    trustScore: 95,
    level: "Trust Pro Level 3"
  },
  { 
    id: "hs_1109", 
    name: "Marcus Wright", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    verified: false,
    trustScore: 42,
    level: "Pending Verification"
  },
  { 
    id: "hs_8876", 
    name: "Elena Rodriguez", 
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    verified: true,
    trustScore: 99,
    level: "Trust Guardian"
  }
];
