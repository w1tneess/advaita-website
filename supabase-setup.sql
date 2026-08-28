-- ==============================================================================
-- Supabase Schema & RLS Setup for advaitachandra.in
-- ==============================================================================
-- Run this script in your Supabase SQL Editor.

-- 1. Create Tables

CREATE TABLE public.projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  project_date text,
  role text,
  visibility text,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  links jsonb DEFAULT '{}'::jsonb,
  tools jsonb DEFAULT '[]'::jsonb,
  methodology jsonb DEFAULT '[]'::jsonb,
  limitations jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at timestamp with time zone
);

CREATE TABLE public.notes (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category text,
  status text NOT NULL CHECK (status IN ('draft', 'published')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at timestamp with time zone
);

CREATE TABLE public.photography (
  id text PRIMARY KEY,
  title text NOT NULL,
  caption text,
  category text NOT NULL CHECK (category IN ('street', 'landscape', 'everyday')),
  image_url text NOT NULL,
  storage_path text NOT NULL,
  alt_text text,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Updated_At Triggers

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER photography_updated_at
  BEFORE UPDATE ON public.photography
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Enable Row Level Security (RLS)

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photography ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Projects
CREATE POLICY "Public can view completed and in_progress projects"
  ON public.projects FOR SELECT
  USING (status IN ('completed', 'in_progress'));

CREATE POLICY "Admin has full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true);

-- Notes
CREATE POLICY "Public can view published notes"
  ON public.notes FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin has full access to notes"
  ON public.notes FOR ALL
  TO authenticated
  USING (true);

-- Photography
CREATE POLICY "Public can view all photography"
  ON public.photography FOR SELECT
  USING (true);

CREATE POLICY "Admin has full access to photography"
  ON public.photography FOR ALL
  TO authenticated
  USING (true);

-- 5. Storage Setup
-- Note: You must have the 'storage' schema available. This is default in Supabase.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('photography', 'photography', true);

CREATE POLICY "Public can view photography images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photography');

CREATE POLICY "Admin can upload/update/delete photography images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'photography');
