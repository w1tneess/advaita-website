-- Supabase Schema for Advaita Website

-- 1. Create the site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the site content
CREATE POLICY "Public read access" ON public.site_content
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to update/insert the content
CREATE POLICY "Authenticated users can update" ON public.site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact submissions
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow only authenticated admins to view contact submissions
CREATE POLICY "Authenticated users can view contact submissions" ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Create Storage bucket for Photography and other images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'images' bucket
CREATE POLICY "Public can view images" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'images');
