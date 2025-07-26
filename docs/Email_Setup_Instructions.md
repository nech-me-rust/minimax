# Email Setup Instructions for Nech mě růst Website

## Overview
The website is now configured to send email notifications to **info@nechmerust.org** for all form submissions including:
- Contact form submissions
- Volunteer applications
- Event registrations

## Current Status
✅ **Forms are working** - All form submissions are being saved to the database
✅ **Email system is ready** - Just needs SMTP credentials to start sending emails
✅ **Logging enabled** - All form data is currently being logged for review

## To Enable Email Notifications

### Option 1: Gmail SMTP (Recommended)
1. **Create/Use Gmail Account**: Use your existing info@nechmerust.org Gmail account
2. **Enable App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate an app password for "Mail"
3. **Set Environment Variables** in your Supabase project:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=info@nechmerust.org
   SMTP_PASSWORD=[your-app-password]
   ```

### Option 2: Professional Email Service
Alternatively, use services like:
- **SendGrid** (recommended for nonprofits)
- **Mailgun**
- **Amazon SES**
- **Your domain's email provider**

## How to Set Environment Variables in Supabase

1. **Go to your Supabase Dashboard**
2. **Select your project**: gzbubgzwwiyqjerkexch
3. **Navigate to**: Settings → Edge Functions → Environment Variables
4. **Add these variables**:
   - `SMTP_HOST`: smtp.gmail.com
   - `SMTP_PORT`: 587
   - `SMTP_USER`: info@nechmerust.org
   - `SMTP_PASSWORD`: [your app password]

## Testing Email Setup

Once you've added the SMTP credentials:
1. Submit a test form on your website
2. Check the Supabase Function logs to see if emails are being sent
3. Check your email inbox for notifications

## Current Form Data Access

Until email is set up, you can view form submissions in your Supabase database:
- **Contact forms**: `contact_submissions` table
- **Volunteer applications**: `volunteer_applications` table  
- **Event registrations**: `event_registrations` table

## Support

If you need help setting up the email system:
1. Check the Supabase Function logs for any error messages
2. Verify your SMTP credentials are correct
3. Ensure your Gmail account has 2-Factor Authentication enabled for app passwords

## Email Template Examples

The system sends formatted emails with all form data, including:
- User contact information
- Form-specific details (volunteer skills, event preferences, etc.)
- Submission timestamp
- Language preference

All emails are sent in a professional format suitable for your organization's needs.
