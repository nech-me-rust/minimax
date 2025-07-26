import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gzbubgzwwiyqjerkexch.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnViZ3p3d2l5cWplcmtleGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzQwOTksImV4cCI6MjA2OTExMDA5OX0.r4a7iKpBWpPSZJWp_ohRlqoRft4fH_AHwQ3uAy60TbY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Animal {
  id: number
  name: string
  species: string
  breed?: string
  age_years?: number
  gender?: string
  arrival_date?: string
  story_cs?: string
  story_en?: string
  personality_cs?: string
  personality_en?: string
  special_needs_cs?: string
  special_needs_en?: string
  is_adoptable: boolean
  is_featured: boolean
  status: string
  image_url?: string
  gallery_images?: any
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  title_cs: string
  title_en: string
  description_cs?: string
  description_en?: string
  start_date: string
  end_date?: string
  location?: string
  max_participants?: number
  current_participants: number
  registration_required: boolean
  registration_deadline?: string
  price: number
  event_type: string
  status: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface VolunteerApplication {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  age?: number
  location?: string
  availability_weekdays: boolean
  availability_weekends: boolean
  availability_mornings: boolean
  availability_afternoons: boolean
  availability_evenings: boolean
  skills?: string
  experience_animals?: string
  experience_farming?: string
  motivation_cs?: string
  motivation_en?: string
  preferred_activities?: any
  emergency_contact_name?: string
  emergency_contact_phone?: string
  has_drivers_license: boolean
  can_lift_heavy: boolean
  allergies?: string
  medical_conditions?: string
  preferred_language: string
  status: string
  notes?: string
  applied_at?: string
  reviewed_at?: string
  reviewed_by?: string
}

export interface ContactSubmission {
  id?: number
  name: string
  email: string
  phone?: string
  subject_cs?: string
  subject_en?: string
  message_cs: string
  message_en?: string
  inquiry_type: string
  preferred_contact_method: string
  preferred_language: string
  responded: boolean
  response_sent_at?: string
  submitted_at?: string
  ip_address?: string
  user_agent?: string
}

export interface EventRegistration {
  id?: number
  event_id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  age?: number
  dietary_restrictions?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  special_requests?: string
  payment_status: string
  payment_method?: string
  payment_amount?: number
  stripe_payment_intent_id?: string
  registered_at?: string
  confirmed_at?: string
  cancelled_at?: string
  cancellation_reason?: string
  preferred_language: string
}