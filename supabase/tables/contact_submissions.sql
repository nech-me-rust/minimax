CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject_cs VARCHAR(200),
    subject_en VARCHAR(200),
    message_cs TEXT NOT NULL,
    message_en TEXT,
    inquiry_type VARCHAR(50) DEFAULT 'general',
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    preferred_language VARCHAR(5) DEFAULT 'cs',
    responded BOOLEAN DEFAULT false,
    response_sent_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);