import { supabase } from './supabase';

const getRandomHost = (seed) => {
  const hosts = [
    { name: "Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
    { name: "Elena", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
    { name: "Marcus", superhost: false, joined: "2020", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    { name: "Sarah", superhost: false, joined: "2021", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" },
    { name: "Vikram", superhost: true, joined: "2019", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" }
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hosts[Math.abs(hash) % hosts.length];
};

console.log("🚀 HavenSafe Version: v1.6.0-dehradun-focus");

const getStoredProperties = () => {
  try {
    const stored = localStorage.getItem('havenSafeProperties');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored properties:", e);
    localStorage.removeItem('havenSafeProperties');
  }
  return null;
};

export const updatePropertyInStore = async (updatedProperty) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .upsert({
        id: updatedProperty.id.length > 20 ? updatedProperty.id : undefined,
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

    if (error) throw error;

    if (updatedProperty.photos && data?.[0]?.id) {
      await supabase.from('property_photos').delete().eq('property_id', data[0].id);
      const photoInserts = updatedProperty.photos.map(ph => ({
        property_id: data[0].id,
        url: ph.url,
        is_verified: ph.isVerified,
        meta_data: ph.meta
      }));
      await supabase.from('property_photos').insert(photoInserts);
    }
  } catch (err) {
    console.warn("Supabase update failed, falling back to localStorage:", err);
    const current = getStoredProperties() || initialProperties;
    const exists = current.some(p => p.id === updatedProperty.id);
    const updated = exists
      ? current.map(p => p.id === updatedProperty.id ? updatedProperty : p)
      : [...current, updatedProperty];
    try {
      localStorage.setItem('havenSafeProperties', JSON.stringify(updated));
    } catch (storageErr) {
      console.warn("⚠️ LocalStorage full");
    }
  }
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
    location: "Jogiwala, Dehradun",
    distance: "2 miles away",
    price: 4500,
    rating: 4.98,
    reviewsCount: 124,
    verifiedReviewsCount: 118,
    verified: true,
    allowUnverifiedGuests: false,
    category: "Design",
    image: "https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1449156001435-d599c72470ab?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Capture One Pro · Secure Enclave", timestamp: "March 15, 2026", gps: "30.2984° N, 78.0772° E" } },
      { id: "p2", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Capture One Pro", timestamp: "March 15, 2026" } }
    ],
    host: { name: "Julian", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
    description: "An architectural marvel in the heart of Jogiwala, Dehradun.",
    reviews: [
      { id: "r1", user: "Vikram Sharma", rating: 5, date: "October 2025", comment: "Perfect stay in Dehradun.", verified: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" }
    ]
  },
  {
    id: "2",
    title: "Himalayan Glass House",
    location: "Mussoorie Road, Dehradun",
    distance: "8 miles away",
    price: 12000,
    rating: 5.0,
    verified: true,
    category: "Amazing views",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Sony A7RV", timestamp: "March 20, 2026" } }
    ],
    host: { name: "Elena", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
    description: "Panoramic views of the Doon valley.",
    reviews: []
  },
  {
    id: "3",
    title: "The Concrete Monolith",
    location: "Rajpur Road, Dehradun",
    distance: "5 miles away",
    price: 8500,
    rating: 4.85,
    verified: true,
    category: "Icons",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Marcus", superhost: false, joined: "2020", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    description: "Brutalist architecture in a lush green setting.",
    reviews: []
  },
  {
    id: "4",
    title: "Infinity Valley Retreat",
    location: "Sahastradhara, Dehradun",
    distance: "10 miles away",
    price: 6500,
    rating: 4.9,
    verified: true,
    category: "Amazing pools",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Sarah", superhost: false, joined: "2021", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
    description: "An infinity pool overlooking the river valley.",
    reviews: []
  },
  {
    id: "5",
    title: "Legacy Hill Fort",
    location: "Cantt, Dehradun",
    distance: "4 miles away",
    price: 25000,
    rating: 5.0,
    verified: true,
    category: "Castles",
    image: "https://images.unsplash.com/photo-1512918766671-ad6507962077?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1512918766671-ad6507962077?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Vikram", superhost: true, joined: "2019", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    description: "Heritage stay in a restored colonial fort.",
    reviews: []
  },
  {
    id: "6",
    title: "Minimalist Dehradun Cube",
    location: "Jogiwala, Dehradun",
    distance: "1 mile away",
    price: 3200,
    rating: 4.7,
    verified: true,
    category: "Tiny homes",
    image: "https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Yuki", superhost: true, joined: "2015", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
    description: "Smart living in a tiny footprint.",
    reviews: []
  },
  {
    id: "7",
    title: "Pine Ridge A-Frame",
    location: "Near Dehradun",
    distance: "15 miles away",
    price: 4800,
    rating: 4.95,
    verified: true,
    category: "A-frames",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Mark", superhost: true, joined: "2018", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    description: "Cozy A-frame cabin in a pine forest.",
    reviews: []
  }
];

export const getProperties = async () => {
  try {
    const { data: properties, error } = await supabase.from('properties').select('*');
    if (error) throw error;
    if (properties && properties.length > 0) {
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
          reviews: []
        };
      });
    }
  } catch (err) {
    console.warn("Supabase fetch failed, falling back to mock data:", err);
  }
  const stored = getStoredProperties();
  return Array.isArray(stored) ? stored : initialProperties;
};

export const getPropertyById = async (id) => {
  try {
    const [propRes, photosRes, reviewsRes] = await Promise.all([
      supabase.from('properties').select('*').eq('id', id).single(),
      supabase.from('property_photos').select('*').eq('property_id', id),
      supabase.from('property_reviews').select('*').eq('property_id', id)
    ]);
    if (propRes.error) throw propRes.error;
    const p = propRes.data;
    return {
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      rating: p.rating,
      reviews_count: p.reviews_count,
      verified_reviews_count: p.verified_reviews_count,
      verified: p.verified,
      category: p.category,
      image: p.image_url,
      description: p.description,
      host: p.host || getRandomHost(p.id),
      photos: photosRes.data?.map(ph => ({
        id: ph.id,
        url: ph.url,
        isVerified: ph.is_verified,
        isAI: ph.is_ai,
        meta: ph.meta_data || ph.metadata
      })) || [],
      reviews: reviewsRes.data?.map(r => ({
        id: r.id,
        user: r.user_name,
        rating: r.rating,
        date: r.date,
        comment: r.comment,
        verified: r.is_verified,
        avatar: r.avatar_url
      })) || []
    };
  } catch (err) {
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
    const { data, error } = await supabase.from('profiles').select('*');
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
    id: "hs_8876",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    verified: true,
    trustScore: 99,
    level: "Trust Guardian"
  }
];
