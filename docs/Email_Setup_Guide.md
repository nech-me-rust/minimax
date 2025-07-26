# Kompletní návod: Nastavení emailu pro web Nech mě růst

## Možnosti nastavení emailu

### Možnost 1: Gmail SMTP (Nejjednodušší)

#### 1. Nastavení Gmail účtu
1. Přihlaste se na Gmail účet info@nechmerust.org
2. Jděte na **Nastavení účtu Google** → **Zabezpečení**
3. Zapněte **2-step verification** (dvoufázové ověření)
4. Jděte na **App passwords** (Hesla aplikací)
5. Vygenerujte nové heslo aplikace pro "Mail"
6. Zkopírujte vygenerované heslo (16 znaků)

#### 2. Konfigurace v Supabase
V Supabase projektu jděte na **Settings** → **Environment Variables** a přidejte:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@nechmerust.org
SMTP_PASSWORD=[heslo_aplikace_z_gmail]
```

### Možnost 2: SendGrid (Profesionální řešení)

#### 1. Registrace SendGrid
1. Jděte na https://sendgrid.com
2. Vytvořte účet (zdarma až 100 emailů/den)
3. Ověřte emailovou adresu
4. Přidejte doménu nechmerust.org

#### 2. Získání API klíče
1. V SendGrid dashboardu jděte na **Settings** → **API Keys**
2. Klikněte **Create API Key**
3. Vyberte **Full Access**
4. Zkopírujte API klíč

#### 3. Konfigurace v Supabase
```
SENDGRID_API_KEY=[váš_api_klíč]
EMAIL_FROM=info@nechmerust.org
```

### Možnost 3: Resend (Moderní řešení)

#### 1. Registrace Resend
1. Jděte na https://resend.com
2. Vytvořte účet
3. Ověřte doménu nechmerust.org

#### 2. Konfigurace
```
RESEND_API_KEY=[váš_api_klíč]
EMAIL_FROM=info@nechmerust.org
```

## Implementace v kódu

Kód už je připraven ve webové aplikaci. Stačí pouze nastavit proměnné prostředí v Supabase.

## Testování

Po nastavení otestujte:
1. Kontaktní formulář na webu
2. Registraci na akce
3. Přihlášku dobrovolníků

---

# Complete Email Setup Guide for Nech mě růst Website

## Email Setup Options

### Option 1: Gmail SMTP (Easiest)

#### 1. Gmail Account Setup
1. Log into Gmail account info@nechmerust.org
2. Go to **Google Account Settings** → **Security**
3. Enable **2-step verification**
4. Go to **App passwords**
5. Generate new app password for "Mail"
6. Copy the generated password (16 characters)

#### 2. Supabase Configuration
In your Supabase project go to **Settings** → **Environment Variables** and add:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@nechmerust.org
SMTP_PASSWORD=[app_password_from_gmail]
```

### Option 2: SendGrid (Professional Solution)

#### 1. SendGrid Registration
1. Go to https://sendgrid.com
2. Create account (free up to 100 emails/day)
3. Verify email address
4. Add domain nechmerust.org

#### 2. Get API Key
1. In SendGrid dashboard go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Select **Full Access**
4. Copy the API key

#### 3. Supabase Configuration
```
SENDGRID_API_KEY=[your_api_key]
EMAIL_FROM=info@nechmerust.org
```

### Option 3: Resend (Modern Solution)

#### 1. Resend Registration
1. Go to https://resend.com
2. Create account
3. Verify domain nechmerust.org

#### 2. Configuration
```
RESEND_API_KEY=[your_api_key]
EMAIL_FROM=info@nechmerust.org
```

## Code Implementation

The code is already prepared in the web application. You only need to set environment variables in Supabase.

## Testing

After setup, test:
1. Contact form on website
2. Event registration
3. Volunteer applications