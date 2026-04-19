import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://aqzhpqtvvjncshdonkjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxemhwcXR2dmpuY3NoZG9ua2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjE1OTgsImV4cCI6MjA5MTI5NzU5OH0.bShVvc11oRtBlyEYP92isJ1EJP29KG4nZRef3pKqxDk';
const supabase = createClient(supabaseUrl, supabaseKey);

const data = JSON.parse(fs.readFileSync('./src/utils/premium_data.json', 'utf8'));

const HOST_MAP = {
  "Vikram Sharma": "11111111-1111-1111-1111-111111111111",
  "Sarah Chen": "22222222-2222-2222-2222-222222222222",
  "Elena Rodriguez": "33333333-3333-3333-3333-333333333333",
  "Elena": "33333333-3333-3333-3333-333333333333",
  "Sarah": "22222222-2222-2222-2222-222222222222",
  "Marcus": "44444444-4444-4444-4444-444444444444",
  "Marcus Wright": "44444444-4444-4444-4444-444444444444",
  "Julian": "44444444-4444-4444-4444-444444444444", // Fallback
  "Yuki": "44444444-4444-4444-4444-444444444444",
  "Mark": "44444444-4444-4444-4444-444444444444"
};

async function seed() {
  console.log("🚀 Starting Supabase Seeding...");

  for (const p of data.properties) {
    console.log(`🏠 Inserting: ${p.title}`);
    
    const host_id = HOST_MAP[p.host.name] || HOST_MAP["Vikram Sharma"];

    const { data: propData, error: propError } = await supabase
      .from('properties')
      .upsert({
        title: p.title,
        location: p.location,
        price: p.price,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        verified_reviews_count: p.verifiedReviewsCount || 0,
        verified: p.verified,
        allow_unverified_guests: p.allowUnverifiedGuests,
        category: p.category,
        image_url: p.image,
        description: p.description,
        // host_id // Skip host_id if it causes FK errors, or use the map
      })
      .select();

    if (propError) {
      console.error(`❌ Error inserting property ${p.title}:`, propError.message);
      continue;
    }

    const propId = propData[0].id;
    console.log(`✅ Property inserted: ${propId}`);

    if (p.photos && p.photos.length > 0) {
      const photos = p.photos.map(ph => ({
        property_id: propId,
        url: ph.url,
        is_verified: ph.isVerified || false,
        meta_data: ph.meta || {}
      }));

      const { error: photoError } = await supabase.from('property_photos').insert(photos);
      if (photoError) console.error(`❌ Error inserting photos for ${p.title}:`, photoError.message);
      else console.log(`🖼  Inserted ${photos.length} photos.`);
    }

    if (p.reviews && p.reviews.length > 0) {
       const reviews = p.reviews.map(r => ({
         property_id: propId,
         user_name: r.user,
         rating: r.rating,
         comment: r.comment,
         date: r.date,
         is_verified: r.verified || false,
         avatar_url: r.avatar
       }));
       const { error: reviewError } = await supabase.from('property_reviews').upsert(reviews);
       if (reviewError) console.error(`❌ Error inserting reviews for ${p.title}:`, reviewError.message);
       else console.log(`💬 Inserted ${reviews.length} reviews.`);
    }
  }

  console.log("🎉 Seeding Complete!");
}

seed();
