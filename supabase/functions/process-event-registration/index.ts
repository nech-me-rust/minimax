Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const registrationData = await req.json();

        console.log('🎫 Processing event registration:', JSON.stringify(registrationData, null, 2));

        // Validate required fields
        const required = ['event_id', 'first_name', 'last_name', 'email'];
        for (const field of required) {
            if (!registrationData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Get Supabase configuration
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // First, get event details
        const eventResponse = await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${registrationData.event_id}&select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!eventResponse.ok) {
            throw new Error('Failed to fetch event details');
        }

        const events = await eventResponse.json();
        if (!events || events.length === 0) {
            throw new Error('Event not found');
        }

        const event = events[0];

        // Check if registration is still open
        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
            throw new Error('Registration deadline has passed');
        }

        // Check if there are available spots
        if (event.max_participants && event.current_participants >= event.max_participants) {
            throw new Error('Event is fully booked');
        }

        // Prepare registration data
        const registrationRecord = {
            event_id: registrationData.event_id,
            first_name: registrationData.first_name,
            last_name: registrationData.last_name,
            email: registrationData.email,
            phone: registrationData.phone || null,
            age: registrationData.age || null,
            dietary_restrictions: registrationData.dietary_restrictions || null,
            emergency_contact_name: registrationData.emergency_contact_name || null,
            emergency_contact_phone: registrationData.emergency_contact_phone || null,
            special_requests: registrationData.special_requests || null,
            payment_status: event.price > 0 ? 'pending' : 'not_required',
            payment_amount: event.price || 0,
            preferred_language: registrationData.preferred_language || 'cs',
            registered_at: new Date().toISOString()
        };

        // Insert registration into database
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/event_registrations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(registrationRecord)
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Failed to save registration: ${errorText}`);
        }

        const registration = await insertResponse.json();
        const registrationId = registration[0].id;

        // Update event participant count
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${registrationData.event_id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_participants: event.current_participants + 1,
                updated_at: new Date().toISOString()
            })
        });

        if (!updateResponse.ok) {
            console.error('Failed to update participant count, but registration was saved');
        }

        // Send notification email
        try {
            const emailData = {
                ...registrationData,
                event_title: registrationData.preferred_language === 'en' ? event.title_en : event.title_cs,
                event_date: new Date(event.start_date).toLocaleDateString(
                    registrationData.preferred_language === 'cs' ? 'cs-CZ' : 'en-US',
                    { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                ),
                payment_amount: event.price,
                payment_status: registrationRecord.payment_status
            };

            const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'event_registration',
                    data: emailData
                })
            });

            if (!emailResponse.ok) {
                console.error('Failed to send notification email');
            }
        } catch (emailError) {
            console.error('Email notification failed:', emailError.message);
        }

        const result = {
            data: {
                success: true,
                registrationId: registrationId,
                eventTitle: registrationData.preferred_language === 'en' ? event.title_en : event.title_cs,
                eventDate: event.start_date,
                participantNumber: event.current_participants + 1,
                totalSpots: event.max_participants,
                paymentRequired: event.price > 0,
                paymentAmount: event.price,
                message: event.price > 0 
                    ? 'Registration successful! Payment instructions will be sent to your email.'
                    : 'Registration successful! We look forward to seeing you at the event.'
            }
        };

        console.log('✅ Event registration completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('💥 Event registration error:', error);

        const errorResponse = {
            error: {
                code: 'EVENT_REGISTRATION_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});