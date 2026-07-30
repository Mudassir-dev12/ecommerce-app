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
      if (!filters.category && !filters.search && filters.minPrice === undefined && filters.maxPrice === undefined) {
        localProductsStore = dbProducts;
        saveLocalProducts(dbProducts);
      }
      const total = count !== null && count !== undefined ? count : dbProducts.length;
      return {
        products: dbProducts,
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
    const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId);
    if (!error && data && data.length > 0) return data.map(mapReview);
  } catch (e) {}
  return mockReviews.filter((r) => r.productId === productId);
}

// ─── Orders & User ────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  return mockOrders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  return mockOrders.find((o) => o.id === id) ?? null;
}

export async function getCurrentUser(): Promise<User> {
  return mockUser;
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
    (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);

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
    sku: productData.sku || `SKU-${Date.now()}`,
  };

  const { data, error } = await supabase.from('products').upsert([payload], { onConflict: 'id' }).select();

  if (error) {
    console.error('Supabase product creation error:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Database error: Failed to save product to Supabase');
  }

  const createdProduct = mapProduct(data[0]);

  const currentList = getLocalProducts();
  const updatedList = [createdProduct, ...currentList.filter(p => p.id !== id)];
  localProductsStore = updatedList;
  saveLocalProducts(updatedList);

  return createdProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const stockCount = updates.stockCount !== undefined ? Number(updates.stockCount) : undefined;
  const inStock = updates.inStock !== undefined ? Boolean(updates.inStock) : (stockCount !== undefined ? stockCount > 0 : undefined);
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

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    const { error: slugErr } = await supabase.from('products').delete().eq('slug', id);
    if (slugErr) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  const currentList = getLocalProducts();
  const updatedList = currentList.filter((p) => p.id !== id && p.slug !== id);
  localProductsStore = updatedList;
  saveLocalProducts(updatedList);

  return true;
}
