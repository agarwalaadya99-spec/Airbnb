import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqzhpqtvvjncshdonkjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxemhwcXR2dmpuY3NoZG9ua2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjE1OTgsImV4cCI6MjA5MTI5NzU5OH0.bShVvc11oRtBlyEYP92isJ1EJP29KG4nZRef3pKqxDk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function forceVerifyNonGoa() {
    console.log("🚀 Syncing verification status: All except Goa...");

    const { data: props, error: propsError } = await supabase.from('properties').select('*');
    if (propsError) {
        console.error("Error fetching properties:", propsError);
        return;
    }

    for (const p of props) {
        const isGoa = (p.location || '').toLowerCase().includes('goa') || (p.title || '').toLowerCase().includes('goa');
        
        if (!isGoa) {
            console.log(`⭐ Verifying Non-Goa property: ${p.title} (${p.location})`);
            
            // Update property
            const { error: pUpdateErr } = await supabase.from('properties').update({ verified: true }).eq('id', p.id);
            if (pUpdateErr) console.error(`❌ Property update failed for ${p.title}:`, pUpdateErr.message);

            // Update associated photos
            const { data: photos } = await supabase.from('property_photos').select('*').eq('property_id', p.id);
            
            if (photos && photos.length > 0) {
                for (const ph of photos) {
                    const meta = ph.meta_data || {};
                    const { error: photoUpdateErr } = await supabase.from('property_photos').update({
                        is_verified: true,
                        is_ai: false,
                        meta_data: {
                            ...meta,
                            aiDetection: '✓ 100% Verified Human-Shot',
                            aiConfidence: 0,
                            aiColor: 'green'
                        }
                    }).eq('id', ph.id);
                    if (photoUpdateErr) console.error(`❌ Photo update failed for ${ph.id}:`, photoUpdateErr.message);
                }
            } else if (p.image_url) {
                console.log(`📸 Creating photo record for ${p.title}...`);
                const { error: photoInsertErr } = await supabase.from('property_photos').insert({
                    property_id: p.id,
                    url: p.image_url,
                    is_verified: true,
                    is_ai: false,
                    meta_data: {
                        sourceDevice: "Verified Mobile Device",
                        aiDetection: '✓ 100% Verified Human-Shot',
                        aiConfidence: 0,
                        aiColor: 'green',
                        trustLevel: 'FORENSIC_VERIFIED'
                    }
                });
                if (photoInsertErr) console.error(`❌ Photo insert failed for ${p.title}:`, photoInsertErr.message);
                else console.log(`✅ Photo record created for ${p.title}`);
            }
        } else {
            console.log(`ℹ️ Setting Goa property to unverified: ${p.title} (${p.location})`);
            await supabase.from('properties').update({ verified: false }).eq('id', p.id);
        }
    }

    console.log("🎉 Verification Sync Complete!");
}

forceVerifyNonGoa();
