const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kghczdhlzymwuytgixyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaGN6ZGhsenltd3V5dGdpeHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDE2MzMsImV4cCI6MjEwMDkxNzYzM30.bjzp8L8DtjO218zMKW9a3E0e1siBCGMiSL57WRh7VWY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = [
  { id: 'cat-electronics', slug: 'electronics', name: 'Electronics', description: 'Cutting-edge gadgets and tech essentials', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80', color: 'from-blue-500 to-indigo-600' },
  { id: 'cat-clothing', slug: 'clothing', name: 'Clothing', description: 'Modern fashion for every occasion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', color: 'from-pink-500 to-rose-600' },
  { id: 'cat-footwear', slug: 'footwear', name: 'Footwear', description: 'Step into style and comfort', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', color: 'from-orange-500 to-amber-600' },
  { id: 'cat-home-living', slug: 'home-living', name: 'Home & Living', description: 'Beautiful pieces for your space', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', color: 'from-emerald-500 to-teal-600' },
  { id: 'cat-beauty', slug: 'beauty', name: 'Beauty', description: 'Skincare, makeup and wellness', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', color: 'from-purple-500 to-violet-600' },
  { id: 'cat-sports', slug: 'sports', name: 'Sports', description: 'Performance gear for athletes', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', color: 'from-cyan-500 to-sky-600' }
];

const newProducts = [
  {
    id: 'prod-101',
    slug: 'sony-wh1000xm5-wireless-headphones',
    name: 'WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    description: 'Industry-leading active noise cancellation with exceptional sound quality and 30h battery life.',
    long_description: 'The Sony WH-1000XM5 headphones set the benchmark for noise-cancelling technology with 8 microphones and twin processors.',
    price: 349.99,
    original_price: 399.99,
    discount: 12,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['headphones', 'wireless', 'sony'],
    images: [
      { id: 'img-101-1', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', alt: 'Sony WH-1000XM5', isPrimary: true }
    ],
    variants: [],
    rating: 4.8,
    review_count: 2847,
    in_stock: true,
    stock_count: 45,
    is_new: true,
    is_featured: true,
    is_best_seller: true,
    sku: 'SNY-WH1000XM5-BLK'
  },
  {
    id: 'prod-102',
    slug: 'apple-airpods-pro-2nd-gen',
    name: 'AirPods Pro (2nd Generation)',
    brand: 'Apple',
    description: 'Rebuilt with next-level Active Noise Cancellation and Adaptive Audio.',
    long_description: 'AirPods Pro 2 feature the H2 chip, delivering up to 2x more noise cancellation than previous generation.',
    price: 249.00,
    original_price: 249.00,
    discount: 0,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['earbuds', 'apple', 'wireless'],
    images: [
      { id: 'img-102-1', url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800&q=80', alt: 'AirPods Pro', isPrimary: true }
    ],
    variants: [],
    rating: 4.7,
    review_count: 5123,
    in_stock: true,
    stock_count: 85,
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    sku: 'APL-APP2-WHT'
  },
  {
    id: 'prod-103',
    slug: 'samsung-galaxy-watch-6-classic',
    name: 'Galaxy Watch 6 Classic 47mm',
    brand: 'Samsung',
    description: 'Iconic rotating bezel with advanced health, ECG, and sleep tracking.',
    long_description: 'The Galaxy Watch 6 Classic combines premium stainless steel design with comprehensive health metrics.',
    price: 399.99,
    original_price: 449.99,
    discount: 11,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['smartwatch', 'samsung', 'wearable'],
    images: [
      { id: 'img-103-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Galaxy Watch 6', isPrimary: true }
    ],
    variants: [],
    rating: 4.6,
    review_count: 1892,
    in_stock: true,
    stock_count: 30,
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    sku: 'SAM-GW6C-47'
  },
  {
    id: 'prod-104',
    slug: 'logitech-mx-master-3s',
    name: 'MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    description: '8K DPI tracking on any surface with MagSpeed electromagnetic scroll wheel.',
    long_description: 'Logitech MX Master 3S features quiet click technology and ultra-fast 1000 lines per second scrolling.',
    price: 99.99,
    original_price: 109.99,
    discount: 9,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['mouse', 'logitech', 'productivity'],
    images: [
      { id: 'img-104-1', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', alt: 'MX Master 3S', isPrimary: true }
    ],
    variants: [],
    rating: 4.9,
    review_count: 3421,
    in_stock: true,
    stock_count: 60,
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    sku: 'LOG-MXM3S-GRP'
  },
  {
    id: 'prod-105',
    slug: 'premium-merino-wool-crewneck-sweater',
    name: '100% Premium Merino Wool Crewneck Sweater',
    brand: 'Nordvik',
    description: 'Ultra-soft extra-fine merino wool providing lightweight natural warmth.',
    long_description: 'Crafted from 100% extra-fine merino wool, offering breathability and timeless style for any season.',
    price: 149.00,
    original_price: 189.00,
    discount: 21,
    category: 'Clothing',
    category_slug: 'clothing',
    tags: ['sweater', 'merino', 'clothing'],
    images: [
      { id: 'img-105-1', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', alt: 'Merino Wool Sweater', isPrimary: true }
    ],
    variants: [],
    rating: 4.6,
    review_count: 782,
    in_stock: true,
    stock_count: 24,
    is_new: true,
    is_featured: true,
    is_best_seller: false,
    sku: 'NRD-MRN-SWT'
  },
  {
    id: 'prod-106',
    slug: 'slim-fit-stretch-chino-pants',
    name: 'Slim Fit Stretch Chino Pants',
    brand: 'Huxley',
    description: 'Versatile stretch-cotton chinos crafted for modern comfort and sharp style.',
    long_description: 'Designed with 97% organic cotton and 3% elastane for seamless mobility from office to weekend.',
    price: 79.99,
    original_price: 99.99,
    discount: 20,
    category: 'Clothing',
    category_slug: 'clothing',
    tags: ['chinos', 'pants', 'clothing'],
    images: [
      { id: 'img-106-1', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', alt: 'Chino Pants', isPrimary: true }
    ],
    variants: [],
    rating: 4.4,
    review_count: 543,
    in_stock: true,
    stock_count: 50,
    is_new: false,
    is_featured: false,
    is_best_seller: true,
    sku: 'HUX-CHN-SLM'
  },
  {
    id: 'prod-107',
    slug: 'new-balance-990v6-sneakers',
    name: '990v6 Made in USA Running Sneakers',
    brand: 'New Balance',
    description: 'Iconic ENCAP midsole cushioning with premium pigskin suede and mesh upper.',
    long_description: 'Made in the USA, the 990v6 delivers legendary comfort and athletic heritage.',
    price: 184.99,
    original_price: 184.99,
    discount: 0,
    category: 'Footwear',
    category_slug: 'footwear',
    tags: ['sneakers', 'new-balance', 'footwear'],
    images: [
      { id: 'img-107-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', alt: 'New Balance 990v6', isPrimary: true }
    ],
    variants: [],
    rating: 4.7,
    review_count: 956,
    in_stock: true,
    stock_count: 35,
    is_new: true,
    is_featured: true,
    is_best_seller: true,
    sku: 'NB-990V6-GRY'
  },
  {
    id: 'prod-108',
    slug: 'scandinavian-marble-table-lamp',
    name: 'Scandinavian Natural Marble Table Lamp',
    brand: 'Lumis',
    description: 'Genuine solid marble base paired with natural linen shade for ambient lighting.',
    long_description: 'Minimalist Scandinavian styling bringing warmth and refined elegance to desks and side tables.',
    price: 129.00,
    original_price: 159.00,
    discount: 19,
    category: 'Home & Living',
    category_slug: 'home-living',
    tags: ['lamp', 'lighting', 'home'],
    images: [
      { id: 'img-108-1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', alt: 'Marble Lamp', isPrimary: true }
    ],
    variants: [],
    rating: 4.7,
    review_count: 312,
    in_stock: true,
    stock_count: 20,
    is_new: false,
    is_featured: true,
    is_best_seller: false,
    sku: 'LMS-TBL-MRB'
  },
  {
    id: 'prod-109',
    slug: 'vitamin-c-serum-20-percent',
    name: 'Vitamin C + E Ferulic 20% Brightening Serum',
    brand: 'Luminex',
    description: 'Potent 20% L-Ascorbic Acid antioxidant serum for firm, glowing skin.',
    long_description: 'Clinically tested formula combining Vitamin C, E, and Ferulic acid to combat aging and uneven skin tone.',
    price: 89.00,
    original_price: 110.00,
    discount: 19,
    category: 'Beauty',
    category_slug: 'beauty',
    tags: ['skincare', 'serum', 'beauty'],
    images: [
      { id: 'img-109-1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', alt: 'Vitamin C Serum', isPrimary: true }
    ],
    variants: [],
    rating: 4.8,
    review_count: 2134,
    in_stock: true,
    stock_count: 70,
    is_new: true,
    is_featured: true,
    is_best_seller: true,
    sku: 'LMX-VTC-20'
  },
  {
    id: 'prod-110',
    slug: 'premium-non-slip-yoga-mat-5mm',
    name: 'Premium Non-Slip Rubber Yoga Mat 5mm',
    brand: 'ZenFlow',
    description: 'Studio-grade natural rubber mat providing high traction and 5mm cushioning.',
    long_description: 'Eco-friendly natural rubber base with closed-cell sweat-resistant surface for yoga and pilates.',
    price: 79.00,
    original_price: 95.00,
    discount: 17,
    category: 'Sports',
    category_slug: 'sports',
    tags: ['yoga', 'sports', 'fitness'],
    images: [
      { id: 'img-110-1', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', alt: 'Yoga Mat', isPrimary: true }
    ],
    variants: [],
    rating: 4.7,
    review_count: 2891,
    in_stock: true,
    stock_count: 40,
    is_new: false,
    is_featured: true,
    is_best_seller: true,
    sku: 'ZFW-YGA-5MM'
  }
];

async function seedDatabase() {
  console.log('Seeding categories...');
  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catErr) {
    console.error('Error seeding categories:', catErr);
    return;
  }
  console.log('Categories seeded successfully!');

  console.log('Seeding 10 products into Supabase PostgreSQL database...');
  const { data, error } = await supabase.from('products').upsert(newProducts, { onConflict: 'id' }).select();
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log(`Successfully inserted/updated ${data.length} products dynamically in Supabase DB!`);
  }
}

seedDatabase();
