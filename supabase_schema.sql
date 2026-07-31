-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    product_count INT DEFAULT 0,
    color TEXT DEFAULT 'bg-slate-500'
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount NUMERIC,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE CASCADE,
    tags JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 0,
    review_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    stock_count INT DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    sku TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    avatar TEXT,
    rating NUMERIC NOT NULL,
    title TEXT,
    body TEXT,
    date TEXT,
    verified BOOLEAN DEFAULT true,
    helpful INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    shipping_address JSONB,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- DROP OLD POLICIES IF THEY EXIST
DROP POLICY IF EXISTS "Public all categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public select categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin delete categories" ON public.categories;

DROP POLICY IF EXISTS "Public all products" ON public.products;
DROP POLICY IF EXISTS "Allow public select products" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update products" ON public.products;
DROP POLICY IF EXISTS "Allow admin delete products" ON public.products;

DROP POLICY IF EXISTS "Public all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public select reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow admin insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow admin update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow admin delete reviews" ON public.reviews;

-- CREATE EXPLICIT RLS POLICIES (TO public, anon, authenticated)
CREATE POLICY "Allow public select categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin insert categories" ON public.categories FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin update categories" ON public.categories FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete categories" ON public.categories FOR DELETE TO public USING (true);

CREATE POLICY "Allow public select products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin insert products" ON public.products FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin update products" ON public.products FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete products" ON public.products FOR DELETE TO public USING (true);

CREATE POLICY "Allow public select reviews" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin update reviews" ON public.reviews FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete reviews" ON public.reviews FOR DELETE TO public USING (true);

-- USER POLICIES FOR ORDERS & PROFILES
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO public USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO public USING (true);

-- 6. SUPABASE STORAGE BUCKET POLICIES (FOR 'images' BUCKET)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Select Images" ON storage.objects;
CREATE POLICY "Public Select Images" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
CREATE POLICY "Public Insert Images" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
CREATE POLICY "Public Update Images" ON storage.objects
FOR UPDATE TO public USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;
CREATE POLICY "Public Delete Images" ON storage.objects
FOR DELETE TO public USING (bucket_id = 'images');


