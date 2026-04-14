import { supabase } from './supabase';

const initialProperties = [];

// One-time clear of old mock data from localStorage to ensure a fresh start
if (typeof window !== 'undefined' && !localStorage.getItem('haven_v2_initialized')) {
  localStorage.removeItem('haven_properties');
  localStorage.setItem('haven_v2_initialized', 'true');
}

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

const getRandomHost = (seed) => {
  const hosts = [
    { name: "Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
    { name: "Elena", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
    { name: "Marcus", superhost: false, joined: "2020", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    { name: "Sarah", superhost: false, joined: "2021", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" },
    { name: "Vikram", superhost: true, joined: "2019", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" }
  ];
  // Simple deterministic random based on string id
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hosts[Math.abs(hash) % hosts.length];
};

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
    const isNew = !updatedProperty.id || updatedProperty.id.length < 10;
    
    const { data, error } = await supabase
      .from('properties')
      .upsert({
        id: isNew ? undefined : updatedProperty.id,
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

    const savedPropertyId = data?.[0]?.id;

    // Attempt to seed photo metadata if it exists
    if (updatedProperty.photos && savedPropertyId) {
      // First, delete old photos to prevent duplicates if we're re-syncing
      await supabase.from('property_photos').delete().eq('property_id', savedPropertyId);

      const photoInserts = updatedProperty.photos.map(ph => ({
        property_id: savedPropertyId,
        url: ph.url,
        is_verified: ph.isVerified,
        meta_data: ph.meta
      }));
      await supabase.from('property_photos').insert(photoInserts);
    }

    // Attempt to persist reviews if they exist
    if (updatedProperty.reviews && savedPropertyId) {
      // Delete existing to allow a clean sync (Standard and simplified for demo)
      await supabase.from('property_reviews').delete().eq('property_id', savedPropertyId);

      const reviewInserts = updatedProperty.reviews.map(rev => ({
        property_id: savedPropertyId,
        user_name: rev.user,
        rating: rev.rating,
        comment: rev.comment,
        date: rev.date,
        is_verified: rev.verified,
        avatar_url: rev.avatar
      }));
      await supabase.from('property_reviews').insert(reviewInserts);
    }

    const result = { ...updatedProperty, id: savedPropertyId };
    return result;
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
    
    return updatedProperty;
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
          host: p.host || getRandomHost(p.id),
          photos: propPhotos.map(ph => ({
            id: ph.id,
            url: ph.url,
            isVerified: ph.is_verified,
            isAI: ph.is_ai,
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
      host: p.host || getRandomHost(p.id),
      photos: propertyPhotos.map(ph => ({
        id: ph.id,
        url: ph.url,
        isVerified: ph.is_verified,
        isAI: ph.is_ai,
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


