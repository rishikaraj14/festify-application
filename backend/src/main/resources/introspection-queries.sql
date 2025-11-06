-- ============================================================================
-- Supabase PostgreSQL Database Introspection Queries
-- Purpose: Extract schema information to generate JPA entity classes
-- Database: Festify Event Management System
-- Generated: November 7, 2025
-- ============================================================================

-- ============================================================================
-- QUERY 1: List all tables in the public schema
-- ============================================================================
-- This query lists all user-defined tables (excluding system tables)
-- Ordered alphabetically for easy reference
-- ============================================================================

SELECT 
    table_name,
    table_type
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_name;


-- ============================================================================
-- QUERY 2: Detailed column information for ALL public tables
-- ============================================================================
-- Returns comprehensive column metadata including:
-- - Column names and positions
-- - Data types (PostgreSQL and UDT types)
-- - NULL constraints
-- - Default values
-- - Character limits
-- - Numeric precision/scale
-- ============================================================================

SELECT 
    c.table_name,
    c.ordinal_position,
    c.column_name,
    c.data_type,
    c.udt_name,                          -- Underlying data type
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,          -- For VARCHAR/CHAR types
    c.numeric_precision,                 -- For NUMERIC/DECIMAL types
    c.numeric_scale,                     -- For NUMERIC/DECIMAL types
    c.datetime_precision,                -- For TIMESTAMP types
    CASE 
        WHEN c.is_identity = 'YES' THEN 'IDENTITY'
        WHEN c.column_default LIKE 'nextval%' THEN 'SEQUENCE'
        ELSE NULL
    END AS auto_increment_type
FROM 
    information_schema.columns c
WHERE 
    c.table_schema = 'public'
ORDER BY 
    c.table_name, 
    c.ordinal_position;


-- ============================================================================
-- QUERY 3: Primary Key constraints
-- ============================================================================
-- Identifies primary key columns for each table
-- Essential for @Id annotation in JPA entities
-- ============================================================================

SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_name,
    kcu.ordinal_position
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
WHERE 
    tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name, 
    kcu.ordinal_position;


-- ============================================================================
-- QUERY 4: Foreign Key constraints and relationships
-- ============================================================================
-- Maps all foreign key relationships between tables
-- Critical for @ManyToOne, @OneToMany, @OneToOne JPA annotations
-- ============================================================================

SELECT 
    tc.table_name AS from_table,
    kcu.column_name AS from_column,
    ccu.table_name AS to_table,
    ccu.column_name AS to_column,
    tc.constraint_name,
    rc.update_rule,
    rc.delete_rule
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name, 
    kcu.column_name;


-- ============================================================================
-- QUERY 5: Unique constraints
-- ============================================================================
-- Identifies unique columns/column combinations
-- Used for @Column(unique=true) or @UniqueConstraint in JPA
-- ============================================================================

SELECT 
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
WHERE 
    tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name, 
    tc.constraint_name,
    kcu.ordinal_position;


-- ============================================================================
-- QUERY 6: Check constraints
-- ============================================================================
-- Lists validation rules defined at the database level
-- Can be used for @Check annotation or validation logic
-- ============================================================================

SELECT 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc
        ON tc.constraint_name = cc.constraint_name
WHERE 
    tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_name,
    tc.constraint_name;


-- ============================================================================
-- QUERY 7: Indexes (for optimization insights)
-- ============================================================================
-- Shows all indexes on public tables
-- Helps identify frequently queried columns
-- ============================================================================

SELECT 
    tablename AS table_name,
    indexname AS index_name,
    indexdef AS index_definition
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, 
    indexname;


-- ============================================================================
-- QUERY 8: Table row counts (data volume estimation)
-- ============================================================================
-- Provides approximate row counts for each table
-- Helps estimate data volume and plan testing
-- Note: Uses pg_class statistics (may not be 100% accurate for recent changes)
-- ============================================================================

SELECT 
    schemaname,
    relname AS table_name,
    n_live_tup AS estimated_row_count,
    n_dead_tup AS dead_rows,
    last_vacuum,
    last_autovacuum
FROM 
    pg_stat_user_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    n_live_tup DESC;


-- ============================================================================
-- QUERY 9: Enum types (custom PostgreSQL types)
-- ============================================================================
-- Lists all custom enum types used in the schema
-- Important for creating corresponding Java enums
-- ============================================================================

SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder AS sort_order
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname = 'public'
ORDER BY 
    t.typname, 
    e.enumsortorder;


-- ============================================================================
-- QUERY 10: Columns using enum types
-- ============================================================================
-- Shows which tables/columns use custom enum types
-- Helps map PostgreSQL enums to Java enums
-- ============================================================================

SELECT 
    c.table_name,
    c.column_name,
    c.udt_name AS enum_type_name,
    c.is_nullable
FROM 
    information_schema.columns c
WHERE 
    c.table_schema = 'public'
    AND c.data_type = 'USER-DEFINED'
ORDER BY 
    c.table_name,
    c.column_name;


-- ============================================================================
-- QUERY 11: Composite view - Complete table structure
-- ============================================================================
-- Combined query showing complete table structure in one view
-- Includes columns, types, constraints, and relationships
-- ============================================================================

SELECT 
    c.table_name,
    c.ordinal_position AS position,
    c.column_name,
    c.data_type,
    c.udt_name,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY'
        WHEN fk.from_column IS NOT NULL THEN 'FOREIGN KEY → ' || fk.to_table || '(' || fk.to_column || ')'
        WHEN uq.column_name IS NOT NULL THEN 'UNIQUE'
        ELSE ''
    END AS constraint_info,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale
FROM 
    information_schema.columns c
    LEFT JOIN (
        -- Primary keys
        SELECT kcu.table_name, kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
    ) pk ON c.table_name = pk.table_name 
        AND c.column_name = pk.column_name
    LEFT JOIN (
        -- Foreign keys
        SELECT 
            kcu.table_name AS from_table,
            kcu.column_name AS from_column,
            ccu.table_name AS to_table,
            ccu.column_name AS to_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
    ) fk ON c.table_name = fk.from_table 
        AND c.column_name = fk.from_column
    LEFT JOIN (
        -- Unique constraints
        SELECT kcu.table_name, kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'UNIQUE'
            AND tc.table_schema = 'public'
    ) uq ON c.table_name = uq.table_name 
        AND c.column_name = uq.column_name
WHERE 
    c.table_schema = 'public'
ORDER BY 
    c.table_name, 
    c.ordinal_position;


-- ============================================================================
-- QUERY 12: PostgreSQL to Java type mapping reference
-- ============================================================================
-- Shows all distinct data types in use and their recommended Java mappings
-- Helpful reference for entity generation
-- ============================================================================

SELECT DISTINCT
    c.data_type,
    c.udt_name,
    CASE c.udt_name
        -- Text types
        WHEN 'varchar' THEN 'String'
        WHEN 'text' THEN 'String'
        WHEN 'char' THEN 'String'
        WHEN 'bpchar' THEN 'String'
        
        -- Numeric types
        WHEN 'int4' THEN 'Integer'
        WHEN 'int8' THEN 'Long'
        WHEN 'int2' THEN 'Short'
        WHEN 'numeric' THEN 'BigDecimal'
        WHEN 'decimal' THEN 'BigDecimal'
        WHEN 'float4' THEN 'Float'
        WHEN 'float8' THEN 'Double'
        
        -- Boolean
        WHEN 'bool' THEN 'Boolean'
        
        -- Date/Time types
        WHEN 'timestamp' THEN 'LocalDateTime'
        WHEN 'timestamptz' THEN 'OffsetDateTime or Instant'
        WHEN 'date' THEN 'LocalDate'
        WHEN 'time' THEN 'LocalTime'
        
        -- UUID
        WHEN 'uuid' THEN 'UUID'
        
        -- JSON
        WHEN 'json' THEN 'String or JsonNode'
        WHEN 'jsonb' THEN 'String or JsonNode'
        
        -- Arrays
        WHEN '_text' THEN 'String[] or List<String>'
        WHEN '_int4' THEN 'Integer[] or List<Integer>'
        
        ELSE 'Check documentation'
    END AS recommended_java_type,
    COUNT(*) AS usage_count
FROM 
    information_schema.columns c
WHERE 
    c.table_schema = 'public'
GROUP BY 
    c.data_type, 
    c.udt_name
ORDER BY 
    usage_count DESC, 
    c.data_type;


-- ============================================================================
-- EXECUTION INSTRUCTIONS
-- ============================================================================
-- 
-- 1. Connect to your Supabase PostgreSQL database using:
--    - Supabase SQL Editor (web interface)
--    - psql command line: psql "postgresql://postgres:[password]@[host]:5432/postgres"
--    - DBeaver, pgAdmin, or any PostgreSQL client
--
-- 2. Run each query individually or all at once
--
-- 3. Export results as CSV or JSON for entity generation
--
-- 4. Key queries for JPA entity generation:
--    - Query 2: Column definitions (field types)
--    - Query 3: Primary keys (@Id)
--    - Query 4: Foreign keys (@ManyToOne, @OneToMany)
--    - Query 9 & 10: Enums (create Java enums)
--    - Query 11: Complete overview
--
-- 5. Note the following Festify tables:
--    - profiles, colleges, categories
--    - events, registrations, tickets, payments
--    - teams, team_members, team_pricing_tiers
--    - notifications, favorites, reviews
--    - event_updates, registration_history, user_credentials
--
-- ============================================================================
