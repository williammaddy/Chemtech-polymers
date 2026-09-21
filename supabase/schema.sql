-- ============================================================
-- CHEMTECH POLYMERS: SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ============================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  category_number TEXT,
  headline TEXT,
  description TEXT,
  banner_image_url TEXT,
  icon_name TEXT DEFAULT 'Droplets',
  accent_color TEXT DEFAULT '#1FA97A',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug TEXT NOT NULL,
  code TEXT,
  tagline TEXT,
  short_desc TEXT,
  description TEXT,
  image_url TEXT,
  pdf_url TEXT,
  specs JSONB DEFAULT '{}'::JSONB,
  features TEXT[] DEFAULT '{}',
  applications TEXT[] DEFAULT '{}',
  curing_notes TEXT,
  badge TEXT,
  accent_color TEXT DEFAULT '#2B3A8F',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. RESOURCES / ARTICLES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT DEFAULT 'General',
  teaser TEXT,
  body TEXT,
  image_url TEXT,
  badge_color TEXT DEFAULT '#1FA97A',
  read_time TEXT DEFAULT '5 min read',
  publish_date TEXT DEFAULT '2026',
  author TEXT DEFAULT 'Chemtech Technical Lab',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. GALLERY IMAGES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. CONTACT INFO TABLE (Single row)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  phone_support TEXT,
  phone_sales TEXT,
  email TEXT,
  email_sales TEXT,
  address TEXT,
  whatsapp_number TEXT,
  map_embed_url TEXT,
  hours TEXT,
  formspree_endpoint TEXT DEFAULT 'https://formspree.io/f/mvkojeyd',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- 1. Public Read (SELECT) for all tables
CREATE POLICY "Allow public read on categories" 
  ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read on products" 
  ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read on resources" 
  ON public.resources FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read on gallery_images" 
  ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read on contact_info" 
  ON public.contact_info FOR SELECT TO anon, authenticated USING (true);

-- 2. Authenticated Admin Full Access (INSERT, UPDATE, DELETE)
CREATE POLICY "Allow admin write on categories" 
  ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write on products" 
  ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write on resources" 
  ON public.resources FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write on gallery_images" 
  ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write on contact_info" 
  ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKETS SETUP
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('product-pdfs', 'product-pdfs', true),
  ('gallery-images', 'gallery-images', true),
  ('category-banners', 'category-banners', true),
  ('resource-images', 'resource-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for storage buckets
CREATE POLICY "Public storage read" 
  ON storage.objects FOR SELECT TO anon, authenticated 
  USING (bucket_id IN ('product-images', 'product-pdfs', 'gallery-images', 'category-banners', 'resource-images'));

-- Authenticated write access for storage buckets
CREATE POLICY "Admin storage insert" 
  ON storage.objects FOR INSERT TO authenticated 
  WITH CHECK (bucket_id IN ('product-images', 'product-pdfs', 'gallery-images', 'category-banners', 'resource-images'));

CREATE POLICY "Admin storage update" 
  ON storage.objects FOR UPDATE TO authenticated 
  USING (bucket_id IN ('product-images', 'product-pdfs', 'gallery-images', 'category-banners', 'resource-images'));

CREATE POLICY "Admin storage delete" 
  ON storage.objects FOR DELETE TO authenticated 
  USING (bucket_id IN ('product-images', 'product-pdfs', 'gallery-images', 'category-banners', 'resource-images'));
