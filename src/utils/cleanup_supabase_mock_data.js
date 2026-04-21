import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqzhpqtvvjncshdonkjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxemhwcXR2dmpuY3NoZG9ua2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjE1OTgsImV4cCI6MjA5MTI5NzU5OH0.bShVvc11oRtBlyEYP92isJ1EJP29KG4nZRef3pKqxDk';
const supabase = createClient(supabaseUrl, supabaseKey);

const mockPropertyTitles = [
  "Eco-Luxe Geometric Cabin",
  "Himalayan Glass House",
  "The Concrete Monolith",
  "Infinity Valley Retreat",
  "Minimalist Dehradun Cube",
  "Pine Ridge A-Frame"
];

async function cleanup() {
  console.log("🧹 Starting Supabase Cleanup...");

  for (const title of mockPropertyTitles) {
    console.log(`🗑 Deleting property: ${title}`);
    
    // Deleting property will cascade to property_photos if schema is correct
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('title', title);

    if (error) {
      console.error(`❌ Error deleting property ${title}:`, error.message);
    } else {
      console.log(`✅ Property deleted: ${title}`);
    }
  }

  // Cleanup potential property_reviews table if it was created/used
  try {
    const { error: reviewError } = await supabase
      .from('property_reviews')
      .delete()
      .filter('user_name', 'in', '("Julian", "Elena", "Marcus", "Sarah", "Yuki", "Mark")');
    if (reviewError) {
       // If table doesn't exist, this might fail, which is fine
       console.log("ℹ️ Note: property_reviews cleanup did not run or table not found.");
    } else {
      console.log("✅ Mock reviews cleaned up.");
    }
  } catch (e) {
    // Ignore errors for non-existent tables
  }

  console.log("✨ Cleanup Complete!");
}

cleanup();
