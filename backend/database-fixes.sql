-- ===================================================================
-- Festify Database Schema Alignment Script
-- Aligns Supabase database with Spring Boot backend implementation
-- Run this in Supabase SQL Editor
-- ===================================================================

-- ANALYSIS: Database already has ALL required columns!
-- events table has 47 columns including all backend needs:
-- ✅ id, title, description, banner_url, category_id, college_id, organizer_id
-- ✅ start_date, end_date, venue, participation_type (ENUM), status (varchar)
-- ✅ created_at, updated_at

-- The database has MANY extra columns (pricing, teams, etc.) that backend ignores
-- This is PERFECT - backend uses simplified schema, database keeps full features

-- 1. Verify profiles table has required columns
DO $$ 
BEGIN
  -- Ensure username exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT;
  END IF;

  -- Ensure is_organizer exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_organizer'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_organizer BOOLEAN DEFAULT FALSE;
  END IF;

  -- Ensure role exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role VARCHAR DEFAULT 'USER';
  END IF;
END $$;


-- 2. Verify colleges table has metadata column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'colleges' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.colleges ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;


-- 3. Verify registrations table has status column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'registrations' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.registrations ADD COLUMN status TEXT DEFAULT 'PENDING';
  END IF;
END $$;


-- 4. Verify teams table has name column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'teams' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.teams ADD COLUMN name VARCHAR;
    -- Copy from team_name if it exists
    UPDATE public.teams SET name = team_name WHERE name IS NULL AND team_name IS NOT NULL;
  END IF;
END $$;


-- 5. Verify payments table has status column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'payments' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.payments ADD COLUMN status TEXT DEFAULT 'PENDING';
  END IF;
END $$;


-- 6. Grant permissions for backend user (postgres)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;


-- 7. Summary - Show what backend will use from events table
SELECT 
  '✅ Database alignment complete - Backend uses simplified schema' as status;

-- Show backend column mapping from events table
SELECT 
  'Backend Event Fields' as mapping_type,
  'events.' || column_name as database_column,
  CASE column_name
    WHEN 'id' THEN 'Event.id (UUID)'
    WHEN 'title' THEN 'Event.title (String)'
    WHEN 'description' THEN 'Event.description (String)'
    WHEN 'banner_url' THEN 'Event.bannerUrl (String)'
    WHEN 'category_id' THEN 'Event.category (Category FK)'
    WHEN 'college_id' THEN 'Event.college (College FK)'
    WHEN 'organizer_id' THEN 'Event.organizer (Profile FK)'
    WHEN 'start_date' THEN 'Event.startDate (OffsetDateTime)'
    WHEN 'end_date' THEN 'Event.endDate (OffsetDateTime)'
    WHEN 'venue' THEN 'Event.venue (String)'
    WHEN 'participation_type' THEN 'Event.participationType (ENUM→String)'
    WHEN 'status' THEN 'Event.status (ENUM→String)'
    WHEN 'created_at' THEN 'Event.createdAt (OffsetDateTime)'
    WHEN 'updated_at' THEN 'Event.updatedAt (OffsetDateTime)'
  END as backend_field,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'events'
  AND column_name IN (
    'id', 'title', 'description', 'banner_url', 'category_id', 
    'college_id', 'organizer_id', 'start_date', 'end_date', 
    'venue', 'participation_type', 'status', 'created_at', 'updated_at'
  )
ORDER BY 
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'title' THEN 2
    WHEN 'description' THEN 3
    WHEN 'banner_url' THEN 4
    WHEN 'category_id' THEN 5
    WHEN 'college_id' THEN 6
    WHEN 'organizer_id' THEN 7
    WHEN 'start_date' THEN 8
    WHEN 'end_date' THEN 9
    WHEN 'venue' THEN 10
    WHEN 'participation_type' THEN 11
    WHEN 'status' THEN 12
    WHEN 'created_at' THEN 13
    WHEN 'updated_at' THEN 14
  END;

-- ===================================================================
-- RESULT: Database is FULLY COMPATIBLE with backend!
-- 
-- What the backend uses from events table:
-- ✅ id, title, description, banner_url
-- ✅ category_id, college_id, organizer_id  
-- ✅ start_date, end_date, venue
-- ✅ participation_type (ENUM cast to String in Java)
-- ✅ status (VARCHAR)
-- ✅ created_at, updated_at
--
-- What the database has EXTRA (ignored by backend):
-- - Pricing: individual_price, team_base_price, entry_fee, prize_pool
-- - Team settings: is_team_event, min/max_team_size
-- - Registration: registration_start/end, max_attendees, current_participants
-- - Media: image_url, poster_url, qr_code_url
-- - Metadata: tags, rules, contact_email/phone, external_link
--
-- This is IDEAL - backend stays simple, database keeps all features!
-- ===================================================================
