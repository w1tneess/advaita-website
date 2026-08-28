-- ==============================================================================
-- Worksheet Generator Schema for Supabase
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to add worksheet generator tables.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: school_details
CREATE TABLE IF NOT EXISTS public.school_details (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   board TEXT, -- e.g., CBSE, ICSE
   grade_level INTEGER,
   subject TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: worksheets
CREATE TABLE IF NOT EXISTS public.worksheets (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   school_id UUID REFERENCES school_details(id),
   title TEXT NOT NULL,
   description TEXT,
   total_marks INTEGER,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: questions
CREATE TABLE IF NOT EXISTS public.questions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   worksheet_id UUID REFERENCES worksheets(id),
   question_text TEXT NOT NULL,
   question_type TEXT, -- e.g., multiple_choice, short_answer, essay
   marks INTEGER,
   options JSONB, -- For multiple choice: {"A": "text", "B": "text"}
   correct_answer TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.school_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_details
CREATE POLICY "Public read access" ON public.school_details
   FOR SELECT
   USING (true);

CREATE POLICY "Admin write access" ON public.school_details
   FOR ALL
   USING (token->>'role' = 'admin')
   WITH CHECK (token->>'role' = 'admin');

-- RLS Policies for worksheets
CREATE POLICY "Public read access" ON public.worksheets
   FOR SELECT
   USING (true);

CREATE POLICY "Admin write access" ON public.worksheets
   FOR ALL
   USING (token->>'role' = 'admin')
   WITH CHECK (token->>'role' = 'admin');

-- RLS Policies for questions
CREATE POLICY "Public read access" ON public.questions
   FOR SELECT
   USING (true);

CREATE POLICY "Admin write access" ON public.questions
   FOR ALL
   USING (token->>'role' = 'admin')
   WITH CHECK (token->>'role' = 'admin');

-- Note: To make this work, you need to:
-- 1. Set user metadata for admin users: { "role": "admin" }
-- 2. Enable "Include user metadata in JWT" in Supabase Auth Settings
