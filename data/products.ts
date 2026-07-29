import type { Product } from '@/types';

export const products: Product[] = [
  // ─── Electronics ──────────────────────────────────────────────────────
  {
    id: 'prod-1',
    slug: 'sony-wh1000xm5-wireless-headphones',
    name: 'WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    longDescription: `The Sony WH-1000XM5 headphones set the benchmark for noise-cancelling technology. Featuring eight microphones and two processors, they deliver unprecedented quiet. Enjoy up to 30 hours of battery life with quick charging — a 3-minute charge gives you 3 hours of playback. The ultra-comfortable design and foldable frame make these perfect for travel and everyday use.

Key Features:
• Industry-leading noise cancellation with 8 microphones
• 30-hour battery life with quick charging
• Multi-point connection — pair with two devices simultaneously
• Speak-to-Chat technology automatically pauses music when you start talking
• Crystal-clear hands-free calling with precise voice pickup`,
    price: 349.99,
    originalPrice: 399.99,
    discount: 13,
    category: 'Electronics',
    categorySlug: 'electronics',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'sony'],
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', alt: 'Sony WH-1000XM5 front view', isPrimary: true },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Sony WH-1000XM5 side view' },
      { id: 'img-1-3', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', alt: 'Sony WH-1000XM5 folded' },
    ],
    variants: [
      { id: 'v-1-1', type: 'color', value: '#000000', label: 'Midnight Black', inStock: true },
      { id: 'v-1-2', type: 'color', value: '#E8E0D5', label: 'Platinum Silver', inStock: true },
    ],
    rating: 4.8,
    reviewCount: 2847,
    inStock: true,
    stockCount: 45,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2024-01-15',
    sku: 'SNY-WH1000XM5-BLK',
  },
  {
    id: 'prod-2',
    slug: 'apple-airpods-pro-2nd-gen',
    name: 'AirPods Pro (2nd Generation)',
    brand: 'Apple',
    description: 'Rebuilt from the ground up with next-level Active Noise Cancellation.',
    longDescription: `AirPods Pro (2nd generation) feature the H2 chip, delivering up to 2x more Active Noise Cancellation than the previous generation. Adaptive Audio dynamically blends Active Noise Cancellation and Transparency mode for the best listening experience in any environment.

Key Features:
• Up to 2x more Active Noise Cancellation vs. previous generation
• Adaptive Audio — dynamically adjusts ANC
• Personalized Spatial Audio with dynamic head tracking
• Up to 30 hours total listening time with case
• MagSafe Charging Case with built-in speaker`,
    price: 249.00,
    originalPrice: 249.00,
    category: 'Electronics',
    categorySlug: 'electronics',
    tags: ['earbuds', 'wireless', 'apple', 'airpods'],
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800&q=80', alt: 'AirPods Pro with case', isPrimary: true },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', alt: 'AirPods Pro open case' },
    ],
    variants: [
      { id: 'v-2-1', type: 'color', value: '#FFFFFF', label: 'White', inStock: true },
    ],
    rating: 4.7,
    reviewCount: 5123,
    inStock: true,
    stockCount: 120,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2023-09-12',
    sku: 'APL-APP-2-WHT',
  },
  {
    id: 'prod-3',
    slug: 'samsung-galaxy-watch-6-classic',
    name: 'Galaxy Watch 6 Classic 47mm',
    brand: 'Samsung',
    description: 'The iconic rotating bezel returns with advanced health tracking.',
    longDescription: `The Galaxy Watch 6 Classic combines iconic design with the most comprehensive health features. The rotating bezel makes navigation intuitive, while the 1.5" Super AMOLED display brings every detail to life. Track sleep, heart rate, blood oxygen and more with precision health sensors.

Key Features:
• Iconic rotating bezel navigation
• Advanced health tracking: BioActive Sensor, ECG, blood pressure
• 1.5" Super AMOLED display
• Up to 40 hours battery life
• 5ATM + IP68 water resistance`,
    price: 399.99,
    originalPrice: 449.99,
    discount: 11,
    category: 'Electronics',
    categorySlug: 'electronics',
    tags: ['smartwatch', 'samsung', 'wearable', 'health'],
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Samsung Galaxy Watch 6 Classic', isPrimary: true },
      { id: 'img-3-2', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', alt: 'Galaxy Watch on wrist' },
    ],
    variants: [
      { id: 'v-3-1', type: 'color', value: '#1a1a1a', label: 'Graphite', inStock: true },
      { id: 'v-3-2', type: 'color', value: '#C0C0C0', label: 'Silver', inStock: true },
      { id: 'v-3-3', type: 'color', value: '#F5E6D3', label: 'Cream', inStock: false },
    ],
    rating: 4.5,
    reviewCount: 1892,
    inStock: true,
    stockCount: 28,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2023-07-26',
    sku: 'SAM-GW6C-47-GRP',
  },
  {
    id: 'prod-4',
    slug: 'logitech-mx-master-3s',
    name: 'MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    description: 'The most advanced master series mouse for creative professionals.',
    longDescription: `MX Master 3S is Logitech's most advanced performance mouse, featuring an 8K DPI sensor that works on any surface including glass. The ultra-fast MagSpeed scroll wheel lets you scroll up to 1000 lines per second with precision stopping. Connect to up to 3 devices and switch with a click.

Key Features:
• 8,000 DPI high-precision sensor — works on glass
• MagSpeed electromagnetic scrolling
• Quiet Click — 90% less noise than standard clicks
• Connect and switch between 3 devices
• 70-day battery on full charge`,
    price: 99.99,
    originalPrice: 109.99,
    discount: 9,
    category: 'Electronics',
    categorySlug: 'electronics',
    tags: ['mouse', 'wireless', 'logitech', 'productivity'],
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', alt: 'Logitech MX Master 3S', isPrimary: true },
      { id: 'img-4-2', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', alt: 'MX Master 3S side view' },
    ],
    variants: [
      { id: 'v-4-1', type: 'color', value: '#2D2D2D', label: 'Graphite', inStock: true },
      { id: 'v-4-2', type: 'color', value: '#E8E0D5', label: 'Pale Grey', inStock: true },
      { id: 'v-4-3', type: 'color', value: '#C94040', label: 'Rose', inStock: true },
    ],
    rating: 4.9,
    reviewCount: 3421,
    inStock: true,
    stockCount: 67,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2023-06-01',
    sku: 'LOG-MXM3S-GRP',
  },
  // ─── Clothing ─────────────────────────────────────────────────────────
  {
    id: 'prod-5',
    slug: 'premium-merino-wool-sweater',
    name: 'Premium Merino Wool Crewneck Sweater',
    brand: 'Nordvik',
    description: 'Ultra-soft 100% merino wool with timeless design.',
    longDescription: `Crafted from 100% extra-fine merino wool, this crewneck sweater offers unrivalled softness and temperature regulation. The natural fibers wick moisture and resist odors, keeping you comfortable all day. A relaxed fit makes it versatile — dress it up or wear casually.

Key Features:
• 100% extra-fine merino wool
• Natural temperature regulation and moisture-wicking
• Classic crewneck silhouette
• Reinforced rib-knit cuffs and hem
• Machine washable`,
    price: 149.00,
    originalPrice: 189.00,
    discount: 21,
    category: 'Clothing',
    categorySlug: 'clothing',
    tags: ['sweater', 'merino', 'wool', 'knitwear'],
    images: [
      { id: 'img-5-1', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', alt: 'Merino Wool Sweater front', isPrimary: true },
      { id: 'img-5-2', url: 'https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=800&q=80', alt: 'Merino Wool Sweater worn' },
    ],
    variants: [
      { id: 'v-5-1', type: 'size', value: 'XS', label: 'XS', inStock: true },
      { id: 'v-5-2', type: 'size', value: 'S',  label: 'S',  inStock: true },
      { id: 'v-5-3', type: 'size', value: 'M',  label: 'M',  inStock: true },
      { id: 'v-5-4', type: 'size', value: 'L',  label: 'L',  inStock: true },
      { id: 'v-5-5', type: 'size', value: 'XL', label: 'XL', inStock: false },
      { id: 'v-5-6', type: 'color', value: '#4A3728', label: 'Walnut Brown', inStock: true },
      { id: 'v-5-7', type: 'color', value: '#2C3E50', label: 'Navy',         inStock: true },
      { id: 'v-5-8', type: 'color', value: '#BDC3C7', label: 'Light Grey',   inStock: true },
    ],
    rating: 4.6,
    reviewCount: 782,
    inStock: true,
    stockCount: 34,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2023-10-01',
    sku: 'NRD-MRN-CRW-BRN',
  },
  {
    id: 'prod-6',
    slug: 'slim-fit-chino-pants',
    name: 'Slim Fit Chino Pants',
    brand: 'Huxley',
    description: 'Smart, versatile chinos that take you from office to weekend.',
    longDescription: `These slim-fit chinos are crafted from a stretch cotton blend for exceptional comfort and a refined silhouette. A mid-rise waist and tapered leg create a modern, flattering shape. Finished with subtle detailing and a clean press crease.

Key Features:
• 97% cotton, 3% elastane for natural stretch
• Mid-rise, slim through the thigh, tapered leg
• Clean press-crease front
• Two side pockets, two back welt pockets
• Available in 30"-36" inseam`,
    price: 79.99,
    category: 'Clothing',
    categorySlug: 'clothing',
    tags: ['chinos', 'pants', 'slim-fit', 'office'],
    images: [
      { id: 'img-6-1', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', alt: 'Slim Fit Chino Pants', isPrimary: true },
    ],
    variants: [
      { id: 'v-6-1', type: 'size', value: '30x30', label: '30×30', inStock: true },
      { id: 'v-6-2', type: 'size', value: '32x30', label: '32×30', inStock: true },
      { id: 'v-6-3', type: 'size', value: '32x32', label: '32×32', inStock: true },
      { id: 'v-6-4', type: 'size', value: '34x32', label: '34×32', inStock: true },
      { id: 'v-6-5', type: 'size', value: '36x32', label: '36×32', inStock: false },
      { id: 'v-6-6', type: 'color', value: '#C2A97E', label: 'Khaki',      inStock: true },
      { id: 'v-6-7', type: 'color', value: '#1B2A3B', label: 'Navy',       inStock: true },
      { id: 'v-6-8', type: 'color', value: '#3C3C3C', label: 'Charcoal',   inStock: true },
    ],
    rating: 4.4,
    reviewCount: 543,
    inStock: true,
    stockCount: 92,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2024-02-14',
    sku: 'HUX-CHN-SLM-KHK',
  },
  {
    id: 'prod-7',
    slug: 'oversized-graphic-tee',
    name: 'Oversized Vintage Graphic Tee',
    brand: 'UrbanThread',
    description: 'Effortlessly cool graphic tee with a relaxed oversized fit.',
    longDescription: `Made from 100% heavyweight ringspun cotton, this oversized tee combines comfort with streetwear-inspired graphics. The boxy silhouette and dropped shoulders create an on-trend look that pairs with anything.

Key Features:
• 100% 220gsm heavyweight ringspun cotton
• Oversized, boxy silhouette with dropped shoulders
• Vintage-washed for a lived-in feel
• Ribbed crewneck collar
• Double-stitched hem for durability`,
    price: 42.00,
    originalPrice: 55.00,
    discount: 24,
    category: 'Clothing',
    categorySlug: 'clothing',
    tags: ['t-shirt', 'graphic', 'oversized', 'streetwear'],
    images: [
      { id: 'img-7-1', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', alt: 'Oversized Graphic Tee front', isPrimary: true },
      { id: 'img-7-2', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', alt: 'Oversized Graphic Tee worn' },
    ],
    variants: [
      { id: 'v-7-1', type: 'size', value: 'S',   label: 'S',   inStock: true },
      { id: 'v-7-2', type: 'size', value: 'M',   label: 'M',   inStock: true },
      { id: 'v-7-3', type: 'size', value: 'L',   label: 'L',   inStock: true },
      { id: 'v-7-4', type: 'size', value: 'XL',  label: 'XL',  inStock: true },
      { id: 'v-7-5', type: 'size', value: 'XXL', label: 'XXL', inStock: true },
      { id: 'v-7-6', type: 'color', value: '#F5F0EB', label: 'Cream', inStock: true },
      { id: 'v-7-7', type: 'color', value: '#2F2F2F', label: 'Black', inStock: true },
    ],
    rating: 4.3,
    reviewCount: 1205,
    inStock: true,
    stockCount: 150,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2023-08-20',
    sku: 'UTH-GRP-OSZ-CRM',
  },
  // ─── Footwear ─────────────────────────────────────────────────────────
  {
    id: 'prod-8',
    slug: 'new-balance-990v6',
    name: '990v6 Made in USA Sneakers',
    brand: 'New Balance',
    description: 'American craftsmanship meets premium comfort in the iconic 990.',
    longDescription: `The 990v6 continues the legendary 990 legacy with premium ENCAP midsole technology for superior cushioning and support. Crafted in New England, USA, with premium suede and mesh upper for breathability and long-lasting durability.

Key Features:
• Made in USA with premium suede/mesh upper
• ENCAP® midsole technology for durability and support
• ACTEVA® midsole for lightweight cushioning
• Pig skin leather lining
• Available in Men's US 7–13`,
    price: 184.99,
    originalPrice: 184.99,
    category: 'Footwear',
    categorySlug: 'footwear',
    tags: ['sneakers', 'new-balance', 'running', 'made-in-usa'],
    images: [
      { id: 'img-8-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', alt: 'New Balance 990v6 side', isPrimary: true },
      { id: 'img-8-2', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', alt: 'New Balance 990v6 front' },
    ],
    variants: [
      { id: 'v-8-1', type: 'size', value: '7',   label: 'US 7',   inStock: true },
      { id: 'v-8-2', type: 'size', value: '8',   label: 'US 8',   inStock: true },
      { id: 'v-8-3', type: 'size', value: '9',   label: 'US 9',   inStock: true },
      { id: 'v-8-4', type: 'size', value: '10',  label: 'US 10',  inStock: true },
      { id: 'v-8-5', type: 'size', value: '11',  label: 'US 11',  inStock: false },
      { id: 'v-8-6', type: 'size', value: '12',  label: 'US 12',  inStock: true },
      { id: 'v-8-7', type: 'color', value: '#808080', label: 'Grey', inStock: true },
      { id: 'v-8-8', type: 'color', value: '#1C1C1C', label: 'Black', inStock: true },
    ],
    rating: 4.7,
    reviewCount: 956,
    inStock: true,
    stockCount: 23,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2023-04-15',
    sku: 'NB-990V6-GRY-10',
  },
  {
    id: 'prod-9',
    slug: 'nike-air-force-1-07',
    name: "Air Force 1 '07 Low",
    brand: 'Nike',
    description: 'The legend lives on in this timeless basketball icon.',
    longDescription: `The Air Force 1 '07 borrows design lines from the original AF-1, combining classic style with modern comfort. Its perforated toe box provides ventilation, while the padded, low-cut collar lets you move freely.

Key Features:
• Genuine leather upper for durability
• Air-sole unit absorbs impact
• Rubber outsole with pivot circle at the heel
• Padded low-cut collar for a comfortable, out-of-the-box feel
• Perforated toe box for ventilation`,
    price: 110.00,
    category: 'Footwear',
    categorySlug: 'footwear',
    tags: ['sneakers', 'nike', 'air-force-1', 'basketball'],
    images: [
      { id: 'img-9-1', url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', alt: 'Nike Air Force 1 white', isPrimary: true },
    ],
    variants: [
      { id: 'v-9-1', type: 'size', value: '7',   label: 'US 7',   inStock: true },
      { id: 'v-9-2', type: 'size', value: '8',   label: 'US 8',   inStock: true },
      { id: 'v-9-3', type: 'size', value: '9',   label: 'US 9',   inStock: true },
      { id: 'v-9-4', type: 'size', value: '10',  label: 'US 10',  inStock: true },
      { id: 'v-9-5', type: 'size', value: '11',  label: 'US 11',  inStock: true },
      { id: 'v-9-6', type: 'size', value: '12',  label: 'US 12',  inStock: true },
      { id: 'v-9-7', type: 'color', value: '#FFFFFF', label: 'White/White', inStock: true },
      { id: 'v-9-8', type: 'color', value: '#1C1C1C', label: 'Black/Black', inStock: true },
    ],
    rating: 4.8,
    reviewCount: 12450,
    inStock: true,
    stockCount: 200,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2020-01-01',
    sku: 'NKE-AF1-07-WHT-10',
  },
  {
    id: 'prod-10',
    slug: 'chelsea-leather-boots',
    name: 'Chelsea Leather Ankle Boots',
    brand: 'Alderton',
    description: 'Handcrafted full-grain leather Chelsea boots with sleek modern lines.',
    longDescription: `These Chelsea boots are constructed from full-grain calfskin leather with a supple leather lining. The elasticated side panels provide an easy slip-on fit, while the low block heel adds a touch of elegance. Resoleable Goodyear welt construction ensures these boots last a lifetime.

Key Features:
• Full-grain calfskin leather upper
• Goodyear welt construction — fully resoleable
• Leather-lined interior
• Elasticated side panels for easy fit
• 3.5cm block heel`,
    price: 289.00,
    originalPrice: 340.00,
    discount: 15,
    category: 'Footwear',
    categorySlug: 'footwear',
    tags: ['boots', 'chelsea', 'leather', 'dress'],
    images: [
      { id: 'img-10-1', url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80', alt: 'Chelsea boots side', isPrimary: true },
      { id: 'img-10-2', url: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80', alt: 'Chelsea boots front' },
    ],
    variants: [
      { id: 'v-10-1', type: 'size', value: '40', label: 'EU 40', inStock: true },
      { id: 'v-10-2', type: 'size', value: '41', label: 'EU 41', inStock: true },
      { id: 'v-10-3', type: 'size', value: '42', label: 'EU 42', inStock: true },
      { id: 'v-10-4', type: 'size', value: '43', label: 'EU 43', inStock: true },
      { id: 'v-10-5', type: 'size', value: '44', label: 'EU 44', inStock: false },
      { id: 'v-10-6', type: 'color', value: '#2C1810', label: 'Dark Brown', inStock: true },
      { id: 'v-10-7', type: 'color', value: '#1C1C1C', label: 'Black',      inStock: true },
    ],
    rating: 4.6,
    reviewCount: 387,
    inStock: true,
    stockCount: 15,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2024-03-01',
    sku: 'ALD-CHE-LTH-BRN-42',
  },
  // ─── Home & Living ────────────────────────────────────────────────────
  {
    id: 'prod-11',
    slug: 'scandi-table-lamp',
    name: 'Scandinavian Marble Base Table Lamp',
    brand: 'Lumis',
    description: 'Elegant marble base with linen shade for warm ambient lighting.',
    longDescription: `Inspired by Scandinavian minimalism, this table lamp features a genuine white marble base and a natural linen shade. The warm glow creates an inviting atmosphere in any room. Compatible with standard E26 LED bulbs up to 60W.

Key Features:
• Genuine white marble base
• Natural linen drum shade
• E26 base — works with standard and LED bulbs
• Inline dimmer switch on cord
• UL listed for safety`,
    price: 129.00,
    originalPrice: 159.00,
    discount: 19,
    category: 'Home & Living',
    categorySlug: 'home-living',
    tags: ['lamp', 'lighting', 'marble', 'scandinavian'],
    images: [
      { id: 'img-11-1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', alt: 'Marble table lamp on desk', isPrimary: true },
      { id: 'img-11-2', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', alt: 'Lamp in living room setting' },
    ],
    variants: [
      { id: 'v-11-1', type: 'color', value: '#F5F5F0', label: 'White Marble', inStock: true },
      { id: 'v-11-2', type: 'color', value: '#1C1C1C', label: 'Black Marble', inStock: true },
    ],
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    stockCount: 40,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2023-11-05',
    sku: 'LMS-TBL-MRB-WHT',
  },
  {
    id: 'prod-12',
    slug: 'bamboo-cutting-board-set',
    name: 'Organic Bamboo Cutting Board Set (3-piece)',
    brand: 'GreenKitchen',
    description: 'Eco-friendly, naturally antibacterial bamboo cutting boards.',
    longDescription: `These premium bamboo cutting boards are crafted from organically grown Moso bamboo — harder than maple yet gentle on knife edges. The natural antibacterial properties of bamboo keep bacteria at bay without chemical treatments.

Key Features:
• 100% organically grown Moso bamboo
• Set of 3: small (6"×9"), medium (9"×12"), large (12"×18")
• Juice groove on large board to catch runoff
• Non-slip rubber feet
• Food-safe mineral oil finish`,
    price: 49.99,
    category: 'Home & Living',
    categorySlug: 'home-living',
    tags: ['kitchen', 'cutting-board', 'bamboo', 'eco'],
    images: [
      { id: 'img-12-1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Bamboo cutting board set', isPrimary: true },
    ],
    variants: [],
    rating: 4.5,
    reviewCount: 876,
    inStock: true,
    stockCount: 110,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2023-03-10',
    sku: 'GRK-BMB-CBD-SET3',
  },
  // ─── Beauty ───────────────────────────────────────────────────────────
  {
    id: 'prod-13',
    slug: 'vitamin-c-serum-20-percent',
    name: 'Vitamin C + E Ferulic 20% Serum',
    brand: 'Luminex',
    description: 'Potent antioxidant serum that brightens, firms, and protects.',
    longDescription: `This advanced formula combines 20% L-Ascorbic Acid (Vitamin C) with Vitamin E and Ferulic Acid for maximum antioxidant efficacy. Clinical studies show visible brightening, reduction of fine lines, and improved skin tone in as little as 4 weeks.

Key Features:
• 20% L-Ascorbic Acid — most bioavailable form of Vitamin C
• Synergistic Vitamin E + Ferulic Acid for enhanced stability
• Vegan and cruelty-free
• Fragrance-free, oil-free
• 30ml amber glass dropper bottle`,
    price: 89.00,
    originalPrice: 110.00,
    discount: 19,
    category: 'Beauty',
    categorySlug: 'beauty',
    tags: ['serum', 'vitamin-c', 'skincare', 'antioxidant'],
    images: [
      { id: 'img-13-1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', alt: 'Vitamin C Serum bottle', isPrimary: true },
      { id: 'img-13-2', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80', alt: 'Serum application' },
    ],
    variants: [],
    rating: 4.8,
    reviewCount: 2134,
    inStock: true,
    stockCount: 78,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2022-09-01',
    sku: 'LMX-VTC-SRM-30ML',
  },
  {
    id: 'prod-14',
    slug: 'hyaluronic-acid-moisturizer',
    name: 'Multi-Layer Hyaluronic Acid Moisturizer',
    brand: 'Luminex',
    description: 'Deep hydration in a lightweight gel-cream that absorbs instantly.',
    longDescription: `This advanced moisturizer uses a multi-molecular weight hyaluronic acid system to hydrate skin at every level. The weightless gel-cream formula absorbs instantly, leaving skin plump, smooth, and radiant — never greasy.

Key Features:
• Triple-weight Hyaluronic Acid for multi-depth hydration
• 72-hour moisture retention
• Non-comedogenic — suitable for all skin types
• Contains Ceramides for barrier repair
• 50ml airless pump bottle`,
    price: 64.00,
    category: 'Beauty',
    categorySlug: 'beauty',
    tags: ['moisturizer', 'hyaluronic-acid', 'skincare', 'hydration'],
    images: [
      { id: 'img-14-1', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', alt: 'Moisturizer jar', isPrimary: true },
    ],
    variants: [],
    rating: 4.6,
    reviewCount: 1567,
    inStock: true,
    stockCount: 95,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2024-01-10',
    sku: 'LMX-HYA-MCR-50ML',
  },
  // ─── Sports ───────────────────────────────────────────────────────────
  {
    id: 'prod-15',
    slug: 'yoga-mat-premium-5mm',
    name: 'Premium Non-Slip Yoga Mat 5mm',
    brand: 'ZenFlow',
    description: 'Studio-quality yoga mat with superior grip and cushioning.',
    longDescription: `The ZenFlow Premium Yoga Mat delivers exceptional grip on both surfaces — your hands and the floor. Made from eco-friendly natural rubber, it provides 5mm of joint-protecting cushioning without sacrificing ground feel. The closed-cell surface prevents sweat from penetrating into the mat.

Key Features:
• Natural rubber base with polyurethane microfiber surface
• 5mm thickness for superior cushioning
• Closed-cell surface — sweat resistant and easy to clean
• 183cm × 61cm — fits all body types
• Includes carrying strap`,
    price: 79.00,
    originalPrice: 95.00,
    discount: 17,
    category: 'Sports',
    categorySlug: 'sports',
    tags: ['yoga', 'mat', 'exercise', 'fitness'],
    images: [
      { id: 'img-15-1', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', alt: 'Yoga mat rolled out', isPrimary: true },
      { id: 'img-15-2', url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80', alt: 'Yoga mat in use' },
    ],
    variants: [
      { id: 'v-15-1', type: 'color', value: '#6B4F8E', label: 'Amethyst', inStock: true },
      { id: 'v-15-2', type: 'color', value: '#2D6A4F', label: 'Forest Green', inStock: true },
      { id: 'v-15-3', type: 'color', value: '#1C1C2E', label: 'Midnight', inStock: true },
      { id: 'v-15-4', type: 'color', value: '#E07A5F', label: 'Terracotta', inStock: false },
    ],
    rating: 4.7,
    reviewCount: 2891,
    inStock: true,
    stockCount: 65,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2022-06-15',
    sku: 'ZFW-YGA-MAT-5MM-AMT',
  },
  {
    id: 'prod-16',
    slug: 'adjustable-dumbbell-set-5-50lb',
    name: 'Adjustable Dumbbell Set 5–50 lb',
    brand: 'IronCore',
    description: 'Replace 15 dumbbells in one compact, quick-adjust design.',
    longDescription: `The IronCore Adjustable Dumbbell replaces 15 sets of weights in one compact unit. The patented selector dial lets you switch weights in seconds — from 5 to 50 lbs in 5 lb increments. The ergonomic handle features a comfortable non-slip grip.

Key Features:
• Adjusts from 5 to 50 lbs in 5 lb increments
• Replaces 15 pairs of traditional dumbbells
• Patented dial control system — change weights in seconds
• Ergonomic non-slip handle
• Compact storage tray included`,
    price: 399.00,
    originalPrice: 499.00,
    discount: 20,
    category: 'Sports',
    categorySlug: 'sports',
    tags: ['dumbbells', 'weights', 'home-gym', 'fitness'],
    images: [
      { id: 'img-16-1', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80', alt: 'Adjustable dumbbell set', isPrimary: true },
    ],
    variants: [],
    rating: 4.9,
    reviewCount: 4102,
    inStock: true,
    stockCount: 18,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2022-01-01',
    sku: 'IRC-ADJ-DMB-550',
  },
  {
    id: 'prod-17',
    slug: 'running-water-bottle-insulated',
    name: 'Insulated Running Water Bottle 32oz',
    brand: 'HydraRun',
    description: 'Keep cold 24h, hot 12h — the ultimate running hydration bottle.',
    longDescription: `The HydraRun Insulated Bottle uses double-wall vacuum insulation to keep your beverages cold for 24 hours or hot for 12 hours. The narrow-mouth design is optimized for running, while the leak-proof lid ensures no spills in your bag.

Key Features:
• Double-wall vacuum insulation — cold 24h / hot 12h
• 32oz / 950ml capacity
• Narrow running mouth — no spills on the go
• BPA-free 18/8 stainless steel
• Straw lid + handle lid included`,
    price: 39.99,
    category: 'Sports',
    categorySlug: 'sports',
    tags: ['water-bottle', 'insulated', 'running', 'hydration'],
    images: [
      { id: 'img-17-1', url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80', alt: 'Insulated water bottle', isPrimary: true },
    ],
    variants: [
      { id: 'v-17-1', type: 'color', value: '#1E3A5F', label: 'Ocean Blue', inStock: true },
      { id: 'v-17-2', type: 'color', value: '#2D6A4F', label: 'Forest Green', inStock: true },
      { id: 'v-17-3', type: 'color', value: '#E07A5F', label: 'Coral', inStock: true },
      { id: 'v-17-4', type: 'color', value: '#1C1C1C', label: 'Matte Black', inStock: true },
    ],
    rating: 4.5,
    reviewCount: 723,
    inStock: true,
    stockCount: 88,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2024-02-01',
    sku: 'HDR-INS-BTL-32-BLU',
  },
  {
    id: 'prod-18',
    slug: 'pro-wireless-mechanical-keyboard',
    name: 'Pro Wireless Mechanical Keyboard TKL',
    brand: 'Keychron',
    description: 'Hot-swappable TKL keyboard with multi-device Bluetooth + USB-C.',
    longDescription: `The Keychron K3 Pro is a compact tenkeyless keyboard with Gateron mechanical switches, per-key RGB backlighting, and seamless switching between 3 Bluetooth devices and USB-C wired mode. The hot-swappable PCB lets you change switches in seconds without soldering.

Key Features:
• Hot-swappable Gateron switches (Red / Brown / Blue options)
• Multi-device — connect 3 Bluetooth + 1 USB-C simultaneously
• Per-key RGB backlighting
• 4000mAh battery — up to 300 hours
• Compact TKL layout — 75% size`,
    price: 109.99,
    originalPrice: 129.99,
    discount: 15,
    category: 'Electronics',
    categorySlug: 'electronics',
    tags: ['keyboard', 'mechanical', 'wireless', 'keychron'],
    images: [
      { id: 'img-18-1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', alt: 'Mechanical keyboard top view', isPrimary: true },
      { id: 'img-18-2', url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80', alt: 'Keyboard with RGB lit' },
    ],
    variants: [
      { id: 'v-18-1', type: 'color', value: '#F5F5F0', label: 'White', inStock: true },
      { id: 'v-18-2', type: 'color', value: '#1C1C1C', label: 'Carbon Black', inStock: true },
    ],
    rating: 4.8,
    reviewCount: 1876,
    inStock: true,
    stockCount: 42,
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2023-05-20',
    sku: 'KCH-K3P-WHT-RED',
  },
  {
    id: 'prod-19',
    slug: 'linen-throw-blanket',
    name: 'Stonewashed Linen Throw Blanket',
    brand: 'Maison & Co',
    description: 'Luxuriously soft stonewashed linen for year-round comfort.',
    longDescription: `This stonewashed linen throw softens with every wash, developing a beautiful, lived-in character. Made from 100% European flax linen, it's naturally temperature-regulating — cool in summer, warm in winter.

Key Features:
• 100% European flax linen
• Stonewashed for immediate softness
• 130cm × 180cm — perfect throw size
• Naturally breathable and hypoallergenic
• Machine washable, tumble dry low`,
    price: 89.00,
    originalPrice: 110.00,
    discount: 19,
    category: 'Home & Living',
    categorySlug: 'home-living',
    tags: ['blanket', 'linen', 'throw', 'home-textiles'],
    images: [
      { id: 'img-19-1', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80', alt: 'Linen throw on sofa', isPrimary: true },
    ],
    variants: [
      { id: 'v-19-1', type: 'color', value: '#E8DDD0', label: 'Oat',      inStock: true },
      { id: 'v-19-2', type: 'color', value: '#C4B8A8', label: 'Sand',     inStock: true },
      { id: 'v-19-3', type: 'color', value: '#6B8F71', label: 'Sage',     inStock: true },
      { id: 'v-19-4', type: 'color', value: '#8B9BB4', label: 'Slate',    inStock: false },
    ],
    rating: 4.7,
    reviewCount: 445,
    inStock: true,
    stockCount: 52,
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2023-09-15',
    sku: 'MSN-LIN-THW-OAT',
  },
  {
    id: 'prod-20',
    slug: 'retinol-night-cream',
    name: 'Advanced Retinol 0.3% Night Cream',
    brand: 'Luminex',
    description: 'Clinically proven retinol to reduce wrinkles and improve skin texture overnight.',
    longDescription: `This advanced night cream combines encapsulated retinol with soothing niacinamide and ceramides for a powerful anti-aging treatment with minimal irritation. The slow-release encapsulation delivers retinol gradually throughout the night for maximum efficacy.

Key Features:
• 0.3% encapsulated Retinol for slow, continuous release
• 5% Niacinamide to minimize potential irritation
• Ceramide complex for barrier repair
• Rich, non-greasy texture absorbs overnight
• 50ml glass jar`,
    price: 72.00,
    category: 'Beauty',
    categorySlug: 'beauty',
    tags: ['retinol', 'anti-aging', 'skincare', 'night-cream'],
    images: [
      { id: 'img-20-1', url: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee0f60?w=800&q=80', alt: 'Night cream jar', isPrimary: true },
    ],
    variants: [],
    rating: 4.5,
    reviewCount: 889,
    inStock: true,
    stockCount: 61,
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    createdAt: '2023-02-14',
    sku: 'LMX-RTN-NGT-50ML',
  },
];
