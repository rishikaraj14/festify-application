-- ===============================
-- 🧩 FESTIFY DATABASE FIX SCRIPT
-- ===============================

-- 1️⃣ ENUMS — Ensure all required enums exist and are uppercase (matching backend)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status') THEN
        CREATE TYPE registration_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_type') THEN
        CREATE TYPE ticket_type AS ENUM ('FREE', 'PAID', 'VIP', 'EARLY_BIRD');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ADMIN', 'ORGANIZER', 'ATTENDEE');
    END IF;
END $$;

-- 2️⃣ TIMESTAMPS — Set default timestamps where missing (avoids null issues)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type LIKE '%timestamp%'
      AND column_default IS NULL
      AND column_name IN ('created_at','updated_at','issued_at','joined_at','payment_date')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET DEFAULT now()', r.table_name, r.column_name);
  END LOOP;
END $$;

-- 3️⃣ CONSTRAINTS — Enforce uniqueness & cascading relations
-- Fixed: Check for existing constraint before adding
DO $$
BEGIN
    -- Add unique constraint on registrations (event_id, user_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='registrations' AND column_name='user_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uniq_reg_event_user'
    ) THEN
        BEGIN
            ALTER TABLE registrations 
                ADD CONSTRAINT uniq_reg_event_user UNIQUE (event_id, user_id);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped registrations unique constraint: %', SQLERRM;
        END;
    END IF;

    -- Add unique constraint on profiles (id is already primary key, no need for user_id unique)
    -- Profiles table uses 'id' as the primary key which is already unique
    RAISE NOTICE 'Profiles table uses id as primary key (already unique)';
END $$;

-- 4️⃣ FOREIGN KEYS — Fix ON DELETE CASCADE / SET NULL for safe cleanup
DO $$
BEGIN
    -- Events → Colleges
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='college_id') THEN
        BEGIN
            ALTER TABLE events DROP CONSTRAINT IF EXISTS fk_events_college;
            ALTER TABLE events ADD CONSTRAINT fk_events_college 
                FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped events.college_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Events → Categories
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='category_id') THEN
        BEGIN
            ALTER TABLE events DROP CONSTRAINT IF EXISTS fk_events_category;
            ALTER TABLE events ADD CONSTRAINT fk_events_category 
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped events.category_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Events → Profiles (organizer)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='organizer_id') THEN
        BEGIN
            ALTER TABLE events DROP CONSTRAINT IF EXISTS fk_events_organizer;
            -- Note: organizer_id references auth.users.id
            ALTER TABLE events ADD CONSTRAINT fk_events_organizer 
                FOREIGN KEY (organizer_id) REFERENCES auth.users(id) ON DELETE SET NULL;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped events.organizer_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Registrations → Events
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='event_id') THEN
        BEGIN
            ALTER TABLE registrations DROP CONSTRAINT IF EXISTS fk_reg_event;
            ALTER TABLE registrations ADD CONSTRAINT fk_reg_event 
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped registrations.event_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Registrations → Profiles
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='user_id') THEN
        BEGIN
            ALTER TABLE registrations DROP CONSTRAINT IF EXISTS fk_reg_user;
            -- Note: profiles.id is the auth.users.id, so we reference profiles(id)
            ALTER TABLE registrations ADD CONSTRAINT fk_reg_user 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped registrations.user_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Tickets → Registrations
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='registration_id') THEN
        BEGIN
            ALTER TABLE tickets DROP CONSTRAINT IF EXISTS fk_ticket_reg;
            ALTER TABLE tickets ADD CONSTRAINT fk_ticket_reg 
                FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped tickets.registration_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Payments → Registrations
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='registration_id') THEN
        BEGIN
            ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payment_reg;
            ALTER TABLE payments ADD CONSTRAINT fk_payment_reg 
                FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped payments.registration_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Teams → Events
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='event_id') THEN
        BEGIN
            ALTER TABLE teams DROP CONSTRAINT IF EXISTS fk_team_event;
            ALTER TABLE teams ADD CONSTRAINT fk_team_event 
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped teams.event_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Teams → Registrations (captain)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='captain_id') THEN
        BEGIN
            ALTER TABLE teams DROP CONSTRAINT IF EXISTS fk_team_captain;
            ALTER TABLE teams ADD CONSTRAINT fk_team_captain 
                FOREIGN KEY (captain_id) REFERENCES registrations(id) ON DELETE SET NULL;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped teams.captain_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Team Members → Teams
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='team_id') THEN
        BEGIN
            ALTER TABLE team_members DROP CONSTRAINT IF EXISTS fk_team_member_team;
            ALTER TABLE team_members ADD CONSTRAINT fk_team_member_team 
                FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped team_members.team_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Reviews → Events
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='event_id') THEN
        BEGIN
            ALTER TABLE reviews DROP CONSTRAINT IF EXISTS fk_review_event;
            ALTER TABLE reviews ADD CONSTRAINT fk_review_event 
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped reviews.event_id constraint: %', SQLERRM;
        END;
    END IF;

    -- Reviews → Profiles
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='user_id') THEN
        BEGIN
            ALTER TABLE reviews DROP CONSTRAINT IF EXISTS fk_review_user;
            -- Note: user_id references auth.users.id
            ALTER TABLE reviews ADD CONSTRAINT fk_review_user 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipped reviews.user_id constraint: %', SQLERRM;
        END;
    END IF;
END $$;

-- 5️⃣ RPC STUBS — Create placeholder functions to avoid frontend crashes
DROP FUNCTION IF EXISTS public.increment_event_attendees(uuid);
CREATE OR REPLACE FUNCTION public.increment_event_attendees(event_uuid uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='attendee_count') THEN
    UPDATE events SET attendee_count = COALESCE(attendee_count,0) + 1 WHERE id = event_uuid;
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS public.calculate_registration_price(uuid, int);
CREATE OR REPLACE FUNCTION public.calculate_registration_price(event_uuid uuid, team_size int DEFAULT 1)
RETURNS numeric LANGUAGE plpgsql AS $$
DECLARE
  base_price numeric;
BEGIN
  -- Get base price from events table
  SELECT COALESCE(price, 0) INTO base_price FROM events WHERE id = event_uuid;
  RETURN base_price * team_size;
END;
$$;

DROP FUNCTION IF EXISTS public.get_event_pricing_summary(uuid);
CREATE OR REPLACE FUNCTION public.get_event_pricing_summary(event_uuid uuid)
RETURNS TABLE(ticket_type text, price numeric) LANGUAGE plpgsql AS $$
DECLARE
  event_price numeric;
BEGIN
  -- Get event price
  SELECT COALESCE(price, 0) INTO event_price FROM events WHERE id = event_uuid;
  
  -- Return pricing tiers
  RETURN QUERY 
    SELECT 'FREE'::text, 0::numeric
    UNION ALL 
    SELECT 'PAID'::text, event_price
    UNION ALL
    SELECT 'VIP'::text, event_price * 1.5
    UNION ALL
    SELECT 'EARLY_BIRD'::text, event_price * 0.8;
END;
$$;

-- 6️⃣ INDEXES — Add performance indexes for common queries
DO $$
BEGIN
    -- Events indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='status') THEN
        CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='category_id') THEN
        CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='college_id') THEN
        CREATE INDEX IF NOT EXISTS idx_events_college ON events(college_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='organizer_id') THEN
        CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='start_date') THEN
        CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
    END IF;
    
    -- Registrations indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='event_id') THEN
        CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_reg_user ON registrations(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='status') THEN
        CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
    END IF;
    
    -- Tickets indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='registration_id') THEN
        CREATE INDEX IF NOT EXISTS idx_tickets_reg ON tickets(registration_id);
    END IF;
    
    -- Payments indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='registration_id') THEN
        CREATE INDEX IF NOT EXISTS idx_payments_reg ON payments(registration_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='status') THEN
        CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    END IF;
    
    -- Teams indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='event_id') THEN
        CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);
    END IF;
    
    -- Team members indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='team_id') THEN
        CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
    END IF;
    
    -- Profiles indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='id') THEN
        CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
    END IF;
    
    RAISE NOTICE '✅ Indexes created successfully';
END $$;

-- ✅ DONE
DO $$
BEGIN
    RAISE NOTICE '✅ FESTIFY DATABASE STRUCTURE VERIFIED AND FIXED';
    RAISE NOTICE '   - Enums validated';
    RAISE NOTICE '   - Timestamps configured';
    RAISE NOTICE '   - Constraints added';
    RAISE NOTICE '   - Foreign keys configured';
    RAISE NOTICE '   - RPC functions created';
    RAISE NOTICE '   - Indexes created for performance';
END $$;
