import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

import { categories } from '../data/categories';
import { products } from '../data/products';
import { reviews } from '../data/reviews';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('🌱 Seeding Supabase database...');

  // 1. Seed Categories
  console.log(`📦 Inserting ${categories.length} categories...`);
  const formattedCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    product_count: c.productCount,
    color: c.color,
  }));

  const { error: catError } = await supabase
    .from('categories')
    .upsert(formattedCategories, { onConflict: 'id' });

  if (catError) {
    console.error('❌ Error seeding categories:', catError.message);
  } else {
    console.log('✅ Categories seeded successfully!');
  }

  // 2. Seed Products
  console.log(`🏷️ Inserting ${products.length} products...`);
  const formattedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    long_description: p.longDescription,
    price: p.price,
    original_price: p.originalPrice || null,
    discount: p.discount || null,
    category: p.category,
    category_slug: p.categorySlug,
    tags: p.tags,
    images: p.images,
    variants: p.variants,
    rating: p.rating,
    review_count: p.reviewCount,
    in_stock: p.inStock,
    stock_count: p.stockCount,
    is_new: p.isNew || false,
    is_featured: p.isFeatured || false,
    is_best_seller: p.isBestSeller || false,
    sku: p.sku,
    created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
  }));

  const { error: prodError } = await supabase
    .from('products')
    .upsert(formattedProducts, { onConflict: 'id' });

  if (prodError) {
    console.error('❌ Error seeding products:', prodError.message);
  } else {
    console.log('✅ Products seeded successfully!');
  }

  // 3. Seed Reviews
  console.log(`⭐ Inserting ${reviews.length} reviews...`);
  const formattedReviews = reviews.map((r) => ({
    id: r.id,
    product_id: r.productId,
    author: r.author,
    avatar: r.avatar,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.date,
    verified: r.verified,
    helpful: r.helpful,
  }));

  const { error: revError } = await supabase
    .from('reviews')
    .upsert(formattedReviews, { onConflict: 'id' });

  if (revError) {
    console.error('❌ Error seeding reviews:', revError.message);
  } else {
    console.log('✅ Reviews seeded successfully!');
  }

  console.log('🎉 Database seeding complete!');
}

seedDatabase().catch((err) => {
  console.error('Fatal error during seeding:', err);
});
