/**
 * scripts/seed.js
 * Run using: node scripts/seed.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables manually from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Parse TS data files manually or provide initial seed dataset
const sampleCategories = [
  { id: 'cat-1', slug: 'electronics', name: 'Electronics', description: 'Gadgets, audio & smart devices', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', product_count: 12, color: 'bg-blue-500' },
  { id: 'cat-2', slug: 'fashion', name: 'Fashion & Wear', description: 'Apparel, shoes & accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', product_count: 8, color: 'bg-purple-500' },
  { id: 'cat-3', slug: 'home-office', name: 'Home & Office', description: 'Furniture & desk setups', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', product_count: 6, color: 'bg-emerald-500' },
  { id: 'cat-4', slug: 'accessories', name: 'Accessories', description: 'Bags, watches & everyday carry', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', product_count: 10, color: 'bg-amber-500' }
];

const sampleProducts = [
  {
    id: 'prod-1',
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise cancelling with two processors and 8 microphones.',
    long_description: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. 2 processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    price: 398.00,
    original_price: 449.99,
    discount: 11,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['audio', 'wireless', 'noise-cancelling'],
    images: [{ id: 'img-1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Sony Headphones', isPrimary: true }],
    variants: [{ id: 'var-1', name: 'Black', price: 398.00, inStock: true }, { id: 'var-2', name: 'Silver', price: 398.00, inStock: true }],
    rating: 4.8,
    review_count: 124,
    in_stock: true,
    stock_count: 25,
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    sku: 'SNY-XM5-BLK'
  },
  {
    id: 'prod-2',
    slug: 'macbook-pro-16-m3',
    name: 'Apple MacBook Pro 16" M3 Max',
    brand: 'Apple',
    description: 'Mind-blowing performance with M3 Max chip and liquid retina XDR display.',
    long_description: 'MacBook Pro blasts forward with M3 Max, a monstrously advanced chip that brings massive performance and capability for the most extreme workflows.',
    price: 3499.00,
    original_price: 3899.00,
    discount: 10,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['laptop', 'apple', 'm3'],
    images: [{ id: 'img-2', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', alt: 'MacBook Pro 16', isPrimary: true }],
    variants: [{ id: 'var-3', name: 'Space Black 36GB/1TB', price: 3499.00, inStock: true }],
    rating: 4.9,
    review_count: 88,
    in_stock: true,
    stock_count: 12,
    is_new: true,
    is_featured: true,
    is_best_seller: true,
    sku: 'AAPL-MBP16-M3'
  },
  {
    id: 'prod-3',
    slug: 'ergonomic-office-chair',
    name: 'Ergonomic Mesh Executive Chair',
    brand: 'ErgoPro',
    description: 'Full lumbar support with 4D armrests and breathable mesh construction.',
    long_description: 'Designed for long hours of focus, the ErgoPro executive chair provides dynamic lumbar adjustment and premium 3D mesh airflow.',
    price: 299.99,
    original_price: 399.99,
    discount: 25,
    category: 'Home & Office',
    category_slug: 'home-office',
    tags: ['chair', 'ergonomic', 'furniture'],
    images: [{ id: 'img-3', url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80', alt: 'Ergonomic Chair', isPrimary: true }],
    variants: [{ id: 'var-4', name: 'Midnight Black', price: 299.99, inStock: true }],
    rating: 4.6,
    review_count: 45,
    in_stock: true,
    stock_count: 18,
    is_new: false,
    is_featured: true,
    is_best_seller: false,
    sku: 'ERGO-CHAIR-01'
  }
];

async function seed() {
  console.log('🚀 Starting Supabase Database Seeding...');

  // 1. Categories
  console.log('📦 Seeding categories...');
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .upsert(sampleCategories, { onConflict: 'id' })
    .select();

  if (catError) {
    console.error('❌ Error seeding categories:', catError.message);
  } else {
    console.log(`✅ ${catData.length} Categories seeded successfully!`);
  }

  // 2. Products
  console.log('🏷️ Seeding products...');
  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .upsert(sampleProducts, { onConflict: 'id' })
    .select();

  if (prodError) {
    console.error('❌ Error seeding products:', prodError.message);
  } else {
    console.log(`✅ ${prodData.length} Products seeded successfully!`);
  }

  console.log('🎉 Seeding complete!');
}

seed();
