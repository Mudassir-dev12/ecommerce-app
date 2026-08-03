/**
 * lib/api.ts
 *
 * API layer — dynamically queries Supabase PostgreSQL database with fallback to local persistent storage.
 */

import { supabase } from '@/lib/supabase';
import { products as mockProducts } from '@/data/products';
import { categories as mockCategories } from '@/data/categories';
import { reviews as mockReviews } from '@/data/reviews';
import { mockOrders, mockUser } from '@/data/orders';
import type {
  Product,
  Category,
  Review,
  Order,
  OrderStatus,
  User,
  ProductFilters,
  SortOption,
  ProductsResponse,
  PromoCode,
} from '@/types';
import { delay } from '@/lib/utils';

const STORAGE_KEY = 'ecommerce_products_data_v3';

// Helper to get local products (with localStorage persistence)
function getLocalProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
  }
  return [];
}



// Helper to save local products to localStorage
function saveLocalProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }
}

// In-memory fallback array initialized from localStorage or mock data
let localProductsStore: Product[] = getLocalProducts();

// Helper Mappers (PostgreSQL snake_case <-> TypeScript camelCase)
function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description || '',
    longDescription: row.long_description || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    discount: row.discount ? Number(row.discount) : undefined,
    category: row.category,
    categorySlug: row.category_slug,
    tags: Array.isArray(row.tags) ? row.tags : [],
    images: Array.isArray(row.images) ? row.images : [],
    variants: Array.isArray(row.variants) ? row.variants : [],
    rating: Number(row.rating || 0),
    reviewCount: Number(row.review_count || 0),
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count || 0),
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    isBestSeller: Boolean(row.is_best_seller),
    createdAt: row.created_at || new Date().toISOString(),
    sku: row.sku || '',
  };
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    image: row.image || '',
    productCount: Number(row.product_count || 0),
    color: row.color || '',
  };
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    author: row.author,
    avatar: row.avatar || '',
    rating: Number(row.rating),
    title: row.title || '',
    body: row.body || '',
    date: row.date || '',
    verified: Boolean(row.verified),
    helpful: Number(row.helpful || 0),
  };
}

// ─── Products ─────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {},
  sort: SortOption = 'featured',
  page = 1,
  perPage = 12,
): Promise<ProductsResponse> {
  try {
    let query = supabase.from('products').select('*', { count: 'exact' });

    if (filters.category) {
      query = query.eq('category_slug', filters.category);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.minRating !== undefined) {
      query = query.gte('rating', filters.minRating);
    }
    if (filters.inStock) {
      query = query.eq('in_stock', true);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
        query = query.order('review_count', { ascending: false });
        break;
      case 'featured':
      default:
        query = query.order('is_featured', { ascending: false });
        break;
    }

    // Pagination
    const from = (page - 1) * perPage;
    const to = page * perPage - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (!error && data !== null) {
      const dbProducts = data.map(mapProduct);
      const localList = getLocalProducts();

      const productMap = new Map<string, Product>();
      // Add local products first
      for (const p of localList) {
        productMap.set(p.id, p);
      }
      // Add DB products (overwriting or complementing local ones)
      for (const p of dbProducts) {
        productMap.set(p.id, p);
      }

      const mergedProducts = Array.from(productMap.values());

      if (!filters.category && !filters.search && filters.minPrice === undefined && filters.maxPrice === undefined) {
        localProductsStore = mergedProducts;
        saveLocalProducts(mergedProducts);
      }
      const total = count !== null && count !== undefined ? count : mergedProducts.length;
      return {
        products: mergedProducts,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.max(1, Math.ceil(total / perPage)),
        },
      };
    }
  } catch (err) {
    console.warn('Supabase fetch failed, using local product store:', err);
  }

  // Fallback to local products store ONLY when Supabase query fails
  let result = [...localProductsStore];
  if (filters.category) result = result.filter((p) => p.categorySlug === filters.category);
  if (filters.minPrice !== undefined) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minRating !== undefined) result = result.filter((p) => p.rating >= filters.minRating!);
  if (filters.inStock) result = result.filter((p) => p.inStock);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  const total = result.length;
  const paginated = result.slice((page - 1) * perPage, page * perPage);

  return {
    products: paginated,
    pagination: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) },
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (!error) {
      return data ? mapProduct(data) : null;
    }
  } catch (e) {}
  const list = getLocalProducts();
  return list.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('is_featured', true).limit(limit);
    if (!error && data) {
      if (data.length > 0) return data.map(mapProduct);
      const { data: allData, error: allErr } = await supabase.from('products').select('*').limit(limit);
      if (!allErr && allData) return allData.map(mapProduct);
    }
  } catch (e) {}
  const list = getLocalProducts();
  const featured = list.filter((p) => p.isFeatured);
  if (featured.length > 0) return featured.slice(0, limit);
  return list.slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('is_best_seller', true).limit(limit);
    if (!error && data) {
      if (data.length > 0) return data.map(mapProduct);
      const { data: allData, error: allErr } = await supabase.from('products').select('*').limit(limit);
      if (!allErr && allData) return allData.map(mapProduct);
    }
  } catch (e) {}
  const list = getLocalProducts();
  return list.filter((p) => p.isBestSeller).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_slug', product.categorySlug)
      .neq('id', product.id)
      .limit(limit);
    if (!error && data) return data.map(mapProduct);
  } catch (e) {}
  const list = getLocalProducts();
  return list.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    if (!error && data) return data.map(mapProduct);
  } catch (e) {}
  const list = getLocalProducts();
  return list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
}

// ─── Categories ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  let categoriesList = mockCategories;
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data && data.length > 0) {
      categoriesList = data.map(mapCategory);
    }
  } catch (e) {}

  try {
    const { products } = await getProducts({}, 'featured', 1, 1000);
    return categoriesList.map((cat) => {
      const count = products.filter(
        (p) =>
          p.categorySlug === cat.slug ||
          p.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        productCount: count,
      };
    });
  } catch (e) {
    return categoriesList;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
    if (!error && data) return mapCategory(data);
  } catch (e) {}
  return mockCategories.find((c) => c.slug === slug) ?? null;
}

// ─── Reviews ──────────────────────────────────────────────────────────────

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(mapReview);
    }
  } catch (e) {
    console.warn('Error fetching reviews for product from Supabase:', e);
  }
  return [];
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(mapReview);
    }
  } catch (e) {
    console.warn('Error fetching all reviews from Supabase:', e);
  }
  return [];
}

export async function createReview(reviewData: {
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}): Promise<Review> {
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId: reviewData.productId,
    author: reviewData.author || 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
    rating: Number(reviewData.rating),
    title: reviewData.title,
    body: reviewData.body,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    verified: true,
    helpful: 0,
  };

  try {
    const payload = {
      id: newReview.id,
      product_id: newReview.productId,
      author: newReview.author,
      avatar: newReview.avatar,
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
      date: newReview.date,
      verified: true,
      helpful: 0,
    };

    const { error } = await supabase.from('reviews').upsert([payload], { onConflict: 'id' });
    if (error) {
      console.warn('Supabase review insert notice:', error.message);
    }

    // Recalculate and update product rating in products table
    const productReviews = await getReviewsByProductId(newReview.productId);
    const allReviews = [newReview, ...productReviews.filter(r => r.id !== newReview.id)];
    const avgRating = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1));
    
    await updateProduct(newReview.productId, {
      rating: avgRating,
      reviewCount: allReviews.length,
    }).catch(() => {});

  } catch (e) {
    console.warn('Error saving review to Supabase:', e);
  }

  // Dispatch custom window event for real-time UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('review-submitted'));
  }

  return newReview;
}

// ─── Orders & User ────────────────────────────────────────────────────────

const ORDERS_STORAGE_KEY = 'ecommerce_orders_data_v1';
const USER_STORAGE_KEY = 'ecommerce_guest_user_v1';

export function getOrCreateGuestUser(): User {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading guest user from localStorage:', e);
    }
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const guestUser: User = {
      id: `guest_${Date.now()}_${randNum}`,
      firstName: 'Guest',
      lastName: `#${randNum}`,
      email: `guest_${randNum}@store.guest`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
      phone: '',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    } catch (e) {
      console.warn('Error saving guest user to localStorage:', e);
    }
    return guestUser;
  }
  return mockUser;
}

export async function getCurrentUser(): Promise<User> {
  return getOrCreateGuestUser();
}

export async function updateCurrentUser(updates: Partial<User>): Promise<User> {
  const current = getOrCreateGuestUser();
  const updated: User = {
    ...current,
    ...updates,
    addresses: updates.addresses || current.addresses || [],
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving updated user to localStorage:', e);
    }
  }
  return updated;
}

function mapOrder(row: any): Order {
  const shippingAddr = row.shipping_address || {};
  return {
    id: row.id,
    userId: row.user_id || shippingAddr.guestUserId || row.userId,
    orderNumber: row.order_number,
    status: (row.status || 'pending') as OrderStatus,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    shipping: Number(row.shipping || 0),
    tax: Number(row.tax || 0),
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    shippingAddress: shippingAddr,
    paymentMethod: row.payment_method || 'Credit Card',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    estimatedDelivery: row.estimated_delivery,
    trackingNumber: row.tracking_number,
  };
}

function getLocalOrders(): Order[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage:', e);
    }
  }
  return [];
}

function saveLocalOrders(orders: Order[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Error writing orders to localStorage:', e);
    }
  }
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const currentUser = getOrCreateGuestUser();
  const now = new Date().toISOString();
  const id = orderData.id || `ord-${Date.now()}`;
  const userId = orderData.userId || currentUser.id;
  const orderNumber =
    orderData.orderNumber ||
    `EC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(
      new Date().getDate()
    ).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const shippingAddressObj = {
    ...(orderData.shippingAddress || {
      id: `addr-${Date.now()}`,
      label: 'Shipping Address',
      firstName: currentUser.firstName || 'Customer',
      lastName: currentUser.lastName || '',
      line1: '123 Main St',
      city: 'City',
      state: 'State',
      zip: '00000',
      country: 'United States',
      phone: '',
    }),
    guestUserId: userId,
  };

  const newOrder: Order = {
    id,
    userId,
    orderNumber,
    status: orderData.status || 'pending',
    items: orderData.items || [],
    subtotal: Number(orderData.subtotal || 0),
    shipping: Number(orderData.shipping || 0),
    tax: Number(orderData.tax || 0),
    discount: Number(orderData.discount || 0),
    total: Number(orderData.total || 0),
    shippingAddress: shippingAddressObj,
    paymentMethod: orderData.paymentMethod || 'Credit Card',
    createdAt: orderData.createdAt || now,
    updatedAt: orderData.updatedAt || now,
    estimatedDelivery:
      orderData.estimatedDelivery ||
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trackingNumber:
      orderData.trackingNumber || `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
  };

  // 0. Automatically decrement product stock for all purchased items
  if (newOrder.items && newOrder.items.length > 0) {
    for (const item of newOrder.items) {
      try {
        const itemSlugOrId = item.productId || item.slug;
        if (!itemSlugOrId) continue;

        const product = await getProductBySlug(itemSlugOrId);
        if (product) {
          const currentStock = Number(product.stockCount || 0);
          const purchasedQty = Number(item.quantity || 1);
          const newStockCount = Math.max(0, currentStock - purchasedQty);
          const newInStock = newStockCount > 0;

          await updateProduct(product.id, {
            stockCount: newStockCount,
            inStock: newInStock,
          });
        }
      } catch (err) {
        console.warn('Notice: Failed to update product stock for item:', item.name, err);
      }
    }
  }

  // 1. Save to local storage immediately so it's instantly available
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders.filter((o) => o.id !== id)];
  saveLocalOrders(updatedOrders);

  // 2. Also save to Supabase
  try {
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');

    const payload = {
      id: newOrder.id,
      user_id: isValidUuid ? userId : null,
      order_number: newOrder.orderNumber,
      status: newOrder.status,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      shipping: newOrder.shipping,
      tax: newOrder.tax,
      discount: newOrder.discount,
      total: newOrder.total,
      shipping_address: newOrder.shippingAddress,
      payment_method: newOrder.paymentMethod,
      created_at: newOrder.createdAt,
      updated_at: newOrder.updatedAt,
    };

    const { error } = await supabase.from('orders').upsert([payload], { onConflict: 'id' });
    if (error) {
      console.warn('Supabase order creation notice:', error.message);
    }
  } catch (e) {
    console.warn('Supabase error on createOrder:', e);
  }

  // Dispatch custom window event for instant cross-component updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('order-placed'));
  }

  return newOrder;
}

export async function getOrders(userIdFilter?: string): Promise<Order[]> {
  const localOrders = getLocalOrders();
  let dbOrders: Order[] = [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbOrders = data.map(mapOrder);
    }
  } catch (err) {
    console.warn('Supabase getOrders failed, using local orders:', err);
  }

  // Combine DB orders & local storage orders uniquely by ID
  const orderMap = new Map<string, Order>();

  for (const o of localOrders) {
    orderMap.set(o.id, o);
  }
  for (const o of dbOrders) {
    orderMap.set(o.id, o);
  }

  let merged = Array.from(orderMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // If userIdFilter is provided (for customer account history), filter to only return that device's orders.
  if (userIdFilter) {
    merged = merged.filter(
      (o) => o.userId === userIdFilter || o.shippingAddress?.guestUserId === userIdFilter
    );
  } else {
    // If no userIdFilter (e.g. for Admin Dashboard), save merged orders and return ALL orders across all devices.
    saveLocalOrders(merged);
  }

  return merged;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const updatedAt = new Date().toISOString();
  try {
    await supabase.from('orders').update({ status, updated_at: updatedAt }).eq('id', id);
  } catch (e) {}

  const current = getLocalOrders();
  const index = current.findIndex((o) => o.id === id);
  if (index > -1) {
    current[index] = { ...current[index], status, updatedAt };
    saveLocalOrders(current);
    return current[index];
  }
  throw new Error('Order not found');
}

export async function deleteOrderFromDb(id: string): Promise<boolean> {
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (e) {}

  const current = getLocalOrders();
  const updated = current.filter((o) => o.id !== id);
  saveLocalOrders(updated);
  return true;
}

// ─── Supabase Storage Image Upload ──────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const sanitizeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${Date.now()}_${sanitizeName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/png',
    });

  if (error) {
    console.error('Supabase Storage Bucket upload error:', error);
    throw new Error(`Supabase Storage Error: ${error.message}. Please configure RLS policies for your 'images' bucket.`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to retrieve public CDN URL from Supabase Storage.');
  }

  return publicUrlData.publicUrl;
}

// ─── Promo Codes ──────────────────────────────────────────────────────────

const PROMO_CODES: PromoCode[] = [
  { code: 'SAVE10', type: 'percentage', value: 10, isValid: true },
  { code: 'WELCOME20', type: 'percentage', value: 20, minOrder: 100, isValid: true },
  { code: 'FLAT15', type: 'fixed', value: 15, isValid: true },
];

export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  await delay(200);
  const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase());
  return promo ?? null;
}

// ─── Admin Product CRUD Operations ────────────────────────────────────────

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const id = productData.id || `prod-${Date.now()}`;
  const slug =
    productData.slug ||
    (productData.name
      ? `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`
      : id);

  const stockCount = Number(productData.stockCount) || 0;
  const inStock = productData.inStock !== undefined ? Boolean(productData.inStock) : stockCount > 0;
  const categorySlug = productData.categorySlug || 'electronics';
  const categoryName = productData.category || 'Electronics';

  // Ensure category exists in categories table to satisfy FK constraint
  try {
    await supabase.from('categories').upsert([
      {
        id: `cat-${categorySlug}`,
        slug: categorySlug,
        name: categoryName,
      }
    ], { onConflict: 'slug' });
  } catch (e) {}

  const payload = {
    id,
    slug,
    name: productData.name || 'Untitled Product',
    brand: productData.brand || 'Generic',
    description: productData.description || '',
    long_description: productData.longDescription || productData.description || '',
    price: Number(productData.price) || 0,
    original_price: productData.originalPrice ? Number(productData.originalPrice) : null,
    discount: productData.discount ? Number(productData.discount) : null,
    category: categoryName,
    category_slug: categorySlug,
    tags: productData.tags || [],
    images: productData.images && productData.images.length > 0 ? productData.images : [
      { id: `img-${Date.now()}`, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: productData.name || 'Product Image', isPrimary: true }
    ],
    variants: productData.variants || [],
    rating: Number(productData.rating) || 5.0,
    review_count: Number(productData.reviewCount) || 1,
    in_stock: inStock && stockCount > 0,
    stock_count: stockCount,
    is_new: Boolean(productData.isNew),
    is_featured: Boolean(productData.isFeatured),
    is_best_seller: Boolean(productData.isBestSeller),
    sku: productData.sku || `SKU-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
  };

  let createdProduct: Product;

  try {
    const { data, error } = await supabase.from('products').upsert([payload], { onConflict: 'id' }).select();

    if (!error && data && data.length > 0) {
      createdProduct = mapProduct(data[0]);
    } else {
      console.warn('Supabase product creation notice:', error?.message);
      createdProduct = {
        id: payload.id,
        slug: payload.slug,
        name: payload.name,
        brand: payload.brand,
        description: payload.description,
        longDescription: payload.long_description,
        price: payload.price,
        originalPrice: payload.original_price ? Number(payload.original_price) : undefined,
        discount: payload.discount ? Number(payload.discount) : undefined,
        category: payload.category,
        categorySlug: payload.category_slug,
        tags: payload.tags,
        images: payload.images,
        variants: payload.variants,
        rating: payload.rating,
        reviewCount: payload.review_count,
        inStock: payload.in_stock,
        stockCount: payload.stock_count,
        isNew: payload.is_new,
        isFeatured: payload.is_featured,
        isBestSeller: payload.is_best_seller,
        createdAt: new Date().toISOString(),
        sku: payload.sku,
      };
    }
  } catch (err: any) {
    console.warn('Supabase save exception (fallback to local):', err?.message || err);
    createdProduct = {
      id: payload.id,
      slug: payload.slug,
      name: payload.name,
      brand: payload.brand,
      description: payload.description,
      longDescription: payload.long_description,
      price: payload.price,
      originalPrice: payload.original_price ? Number(payload.original_price) : undefined,
      discount: payload.discount ? Number(payload.discount) : undefined,
      category: payload.category,
      categorySlug: payload.category_slug,
      tags: payload.tags,
      images: payload.images,
      variants: payload.variants,
      rating: payload.rating,
      reviewCount: payload.review_count,
      inStock: payload.in_stock,
      stockCount: payload.stock_count,
      isNew: payload.is_new,
      isFeatured: payload.is_featured,
      isBestSeller: payload.is_best_seller,
      createdAt: new Date().toISOString(),
      sku: payload.sku,
    };
  }

  const currentList = getLocalProducts();
  const updatedList = [createdProduct, ...currentList.filter((p) => p.id !== id && p.slug !== createdProduct.slug)];
  localProductsStore = updatedList;
  saveLocalProducts(updatedList);

  return createdProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const stockCount = updates.stockCount !== undefined ? Number(updates.stockCount) : undefined;
  const inStock = stockCount !== undefined
    ? stockCount > 0
    : (updates.inStock !== undefined ? Boolean(updates.inStock) : undefined);
  const categorySlug = updates.categorySlug || undefined;
  const categoryName = updates.category || undefined;

  if (categorySlug) {
    try {
      await supabase.from('categories').upsert([
        {
          id: `cat-${categorySlug}`,
          slug: categorySlug,
          name: categoryName || categorySlug,
        }
      ], { onConflict: 'slug' });
    } catch (e) {}
  }

  const payload: any = { id };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.brand !== undefined) payload.brand = updates.brand;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.longDescription !== undefined) payload.long_description = updates.longDescription;
  if (updates.price !== undefined) payload.price = Number(updates.price);
  if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice ? Number(updates.originalPrice) : null;
  if (updates.discount !== undefined) payload.discount = updates.discount ? Number(updates.discount) : null;
  if (categoryName !== undefined) payload.category = categoryName;
  if (categorySlug !== undefined) payload.category_slug = categorySlug;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.images !== undefined) payload.images = updates.images;
  if (updates.variants !== undefined) payload.variants = updates.variants;
  if (updates.rating !== undefined) payload.rating = Number(updates.rating);
  if (updates.reviewCount !== undefined) payload.review_count = Number(updates.reviewCount);
  if (updates.isNew !== undefined) payload.is_new = Boolean(updates.isNew);
  if (updates.isFeatured !== undefined) payload.is_featured = Boolean(updates.isFeatured);
  if (updates.isBestSeller !== undefined) payload.is_best_seller = Boolean(updates.isBestSeller);
  if (updates.sku !== undefined) payload.sku = updates.sku;
  if (stockCount !== undefined) payload.stock_count = stockCount;
  if (inStock !== undefined) payload.in_stock = inStock;

  let updatedProduct: Product | null = null;

  // Attempt update by ID first
  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select();
  if (!error && data && data.length > 0) {
    updatedProduct = mapProduct(data[0]);
  } else {
    // Attempt update by slug if ID matching returned 0 rows
    const { data: slugData, error: slugError } = await supabase
      .from('products')
      .update(payload)
      .eq('slug', id)
      .select();
    if (!slugError && slugData && slugData.length > 0) {
      updatedProduct = mapProduct(slugData[0]);
    } else {
      // Fall back to upsert by payload (guarantees update or insert in Supabase DB)
      const { data: upsertData, error: upsertError } = await supabase.from('products').upsert([payload], { onConflict: 'id' }).select();
      if (!upsertError && upsertData && upsertData.length > 0) {
        updatedProduct = mapProduct(upsertData[0]);
      } else {
        const errMsg = error?.message || slugError?.message || upsertError?.message || 'Database product update failed';
        throw new Error(`Database error: ${errMsg}`);
      }
    }
  }

  const currentList = getLocalProducts();
  const index = currentList.findIndex((p) => p.id === id || p.slug === id);
  if (index > -1) {
    currentList[index] = updatedProduct;
  } else {
    currentList.unshift(updatedProduct);
  }
  localProductsStore = currentList;
  saveLocalProducts(currentList);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('order-placed'));
  }

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Find product details to extract its image URLs for bucket cleanup
  try {
    const productToDelete = await getProductBySlug(id);
    if (productToDelete && Array.isArray(productToDelete.images)) {
      for (const img of productToDelete.images) {
        if (img.url && img.url.includes('/storage/v1/object/public/images/')) {
          const filePath = img.url.split('/storage/v1/object/public/images/')[1];
          if (filePath) {
            const cleanPath = decodeURIComponent(filePath.split('?')[0]);
            const { error: storageErr } = await supabase.storage
              .from('images')
              .remove([cleanPath]);
            if (storageErr) {
              console.warn('Notice deleting product image from Supabase Storage:', storageErr.message);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error during product image bucket deletion:', e);
  }

  // 2. Delete product record from Supabase DB
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    await supabase.from('products').delete().eq('slug', id);
  }

  // 3. Remove product from local products store
  const currentList = getLocalProducts();
  const updatedList = currentList.filter((p) => p.id !== id && p.slug !== id);
  localProductsStore = updatedList;
  saveLocalProducts(updatedList);

  return true;
}
