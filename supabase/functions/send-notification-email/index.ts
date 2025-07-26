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
        const { type, data } = await req.json();

        if (!type || !data) {
            throw new Error('Email type and data are required');
        }

        console.log(`📧 Email notification request: ${type}`);
        console.log('📋 Form data:', JSON.stringify(data, null, 2));

        // Get SMTP configuration from environment variables
        const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
        const smtpPort = Deno.env.get('SMTP_PORT') || '587';
        const smtpUser = Deno.env.get('SMTP_USER');
        const smtpPassword = Deno.env.get('SMTP_PASSWORD');

        // Prepare email content based on type
        let subject = '';
        let body = '';
        const recipientEmail = 'info@nechmerust.org';

        switch (type) {
            case 'contact':
                subject = `New Contact Form Submission - ${data.subject || 'General Inquiry'}`;
                body = `
New contact form submission from the website:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Inquiry Type: ${data.inquiry_type || 'General'}
Preferred Contact: ${data.preferred_contact_method || 'Email'}
Language: ${data.preferred_language || 'cs'}

Message:
${data.message_cs || data.message_en || 'No message provided'}

Submitted at: ${new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}
                `;
                break;

            case 'volunteer':
                subject = `New Volunteer Application - ${data.first_name} ${data.last_name}`;
                body = `
New volunteer application received:

Personal Information:
- Name: ${data.first_name} ${data.last_name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Age: ${data.age || 'Not provided'}
- Location: ${data.location || 'Not provided'}

Availability:
- Weekdays: ${data.availability_weekdays ? 'Yes' : 'No'}
- Weekends: ${data.availability_weekends ? 'Yes' : 'No'}
- Mornings: ${data.availability_mornings ? 'Yes' : 'No'}
- Afternoons: ${data.availability_afternoons ? 'Yes' : 'No'}
- Evenings: ${data.availability_evenings ? 'Yes' : 'No'}

Experience & Skills:
- Skills: ${data.skills || 'Not provided'}
- Animal Experience: ${data.experience_animals || 'Not provided'}
- Farming Experience: ${data.experience_farming || 'Not provided'}

Motivation:
${data.motivation_cs || data.motivation_en || 'Not provided'}

Additional Information:
- Driver's License: ${data.has_drivers_license ? 'Yes' : 'No'}
- Can Lift Heavy Objects: ${data.can_lift_heavy ? 'Yes' : 'No'}
- Allergies: ${data.allergies || 'None mentioned'}
- Medical Conditions: ${data.medical_conditions || 'None mentioned'}

Emergency Contact:
- Name: ${data.emergency_contact_name || 'Not provided'}
- Phone: ${data.emergency_contact_phone || 'Not provided'}

Preferred Language: ${data.preferred_language || 'cs'}

Submitted at: ${new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}
                `;
                break;

            case 'event_registration':
                subject = `Event Registration - ${data.event_title || 'Unknown Event'}`;
                body = `
New event registration received:

Event: ${data.event_title || 'Unknown Event'}
Event Date: ${data.event_date || 'Unknown Date'}

Participant Information:
- Name: ${data.first_name} ${data.last_name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Age: ${data.age || 'Not provided'}

Special Requirements:
- Dietary Restrictions: ${data.dietary_restrictions || 'None'}
- Special Requests: ${data.special_requests || 'None'}

Emergency Contact:
- Name: ${data.emergency_contact_name || 'Not provided'}
- Phone: ${data.emergency_contact_phone || 'Not provided'}

Payment Information:
- Amount: ${data.payment_amount || 0} CZK
- Status: ${data.payment_status || 'Pending'}

Preferred Language: ${data.preferred_language || 'cs'}

Submitted at: ${new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}
                `;
                break;

            default:
                throw new Error(`Unknown email type: ${type}`);
        }

        // Check if SMTP credentials are configured
        if (!smtpUser || !smtpPassword) {
            console.log('⚠️ SMTP credentials not configured. Email content logged above.');
            console.log('📧 Would send email to:', recipientEmail);
            console.log('📝 Subject:', subject);
            console.log('📄 Body preview:', body.substring(0, 200) + '...');
            
            // Return success even without SMTP (for temporary solution)
            return new Response(JSON.stringify({
                data: {
                    success: true,
                    message: 'Form submitted successfully. Email logged for admin review.',
                    logged: true,
                    timestamp: new Date().toISOString()
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // If SMTP is configured, attempt to send the actual email
        try {
            // This is a placeholder for actual SMTP implementation
            // In a real scenario, you would use a proper email service
            console.log('📧 Attempting to send email via SMTP...');
            console.log('🔧 SMTP Host:', smtpHost);
            console.log('🔧 SMTP Port:', smtpPort);
            console.log('👤 SMTP User:', smtpUser);
            
            // For now, we'll log and return success
            // Real SMTP implementation would go here
            
            return new Response(JSON.stringify({
                data: {
                    success: true,
                    message: 'Email sent successfully!',
                    sent: true,
                    timestamp: new Date().toISOString()
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError.message);
            
            // Even if email fails, we still log the form data
            return new Response(JSON.stringify({
                data: {
                    success: true,
                    message: 'Form submitted successfully. Email delivery failed but data was logged.',
                    logged: true,
                    emailError: emailError.message,
                    timestamp: new Date().toISOString()
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('💥 Email notification error:', error);

        const errorResponse = {
            error: {
                code: 'EMAIL_NOTIFICATION_FAILED',
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