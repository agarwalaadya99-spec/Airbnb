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

export const updatePropertyInStore = (updatedProperty) => {
  const current = getStoredProperties() || initialProperties;
  const exists = current.some(p => p.id === updatedProperty.id);
  
  const updated = exists 
    ? current.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    : [...current, updatedProperty];
    
  localStorage.setItem('havenSafeProperties', JSON.stringify(updated));
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
    description: "A architectural marvel nestled in the high desert, this geometric cabin offers panoramic mountain views and refined minimalist interiors."
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
    description: "Suspended over the Pacific, this glass villa provides an immersive oceanic experience with floor-to-ceiling windows."
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
    description: "A 5,500 sq ft mirror-cladding home that reflects its stunning surroundings while offering unparalleled luxury."
  },
  {
    id: "4",
    title: "Cliffside Sanctuary",
    location: "Big Sur, California",
    distance: "150 miles away",
    price: 850,
    rating: 4.99,
    reviewsCount: 215,
    verifiedReviewsCount: 190,
    verified: true,
    allowUnverifiedGuests: true,
    category: "A-frames",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200", isVerified: true, meta: { sourceDevice: "Leica SL3", timestamp: "March 10, 2026" } },
      { id: "p2", url: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1200", isVerified: true }
    ],
    host: { name: "Sophia", superhost: true, joined: "2016", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
    description: "Perched on a rugged cliffside, this sanctuary offers breathtaking views of the Pacific coast."
  }
];

export const getProperties = () => {
  const stored = getStoredProperties();
  return Array.isArray(stored) ? stored : initialProperties;
};

// Backward compatibility for components importing static 'properties'
export const properties = getProperties();

export const categories = [
  { id: "icons", name: "Icons", icon: "Stars" },
  { id: "amazing-views", name: "Amazing views", icon: "Mountain" },
  { id: "design", name: "Design", icon: "Palmtree" },
  { id: "amazing-pools", name: "Amazing pools", icon: "Waves" },
  { id: "castles", name: "Castles", icon: "Castle" },
  { id: "tiny-homes", name: "Tiny homes", icon: "Home" },
  { id: "a-frames", name: "A-frames", icon: "Triangle" }
];

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
