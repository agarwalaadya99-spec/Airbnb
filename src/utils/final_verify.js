import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqzhpqtvvjncshdonkjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxemhwcXR2dmpuY3NoZG9ua2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjE1OTgsImV4cCI6MjA5MTI5NzU5OH0.bShVvc11oRtBlyEYP92isJ1EJP29KG4nZRef3pKqxDk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data, error } = await supabase.from('property_photos').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Count:", data.length);
        console.log("Data:", JSON.stringify(data, null, 2));
    }
}

verify();
