/**
 * lib/api.ts
 *
 * API abstraction layer — all data access goes through these functions.
 * Currently backed by local mock data. To swap in a real backend, replace
 * each function body with a fetch() call to your API endpoint.
 */

import { products }   from '@/data/products';
import { categories } from '@/data/categories';
import { reviews }    from '@/data/reviews';
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

// Simulate network latency in dev (ms). Set to 0 to disable.
const SIMULATED_DELAY = 200;

// ─── Products ─────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {},
  sort: SortOption = 'featured',
  page = 1,
  perPage = 12,
): Promise<ProductsResponse> {
  await delay(SIMULATED_DELAY);

  let result = [...products];

  // Apply filters
  if (filters.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    );
  }

  // Apply sort
  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popularity':
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'featured':
    default:
      result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      break;
  }

  const total = result.length;
  const totalPages = Math.ceil(total / perPage);
  const paginated = result.slice((page - 1) * perPage, page * perPage);

  return {
    products: paginated,
    pagination: { page, perPage, total, totalPages },
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(SIMULATED_DELAY);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  await delay(SIMULATED_DELAY);
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  await delay(SIMULATED_DELAY);
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await delay(SIMULATED_DELAY);
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  await delay(SIMULATED_DELAY);
  const q = query.toLowerCase();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

// ─── Categories ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  await delay(SIMULATED_DELAY);
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(SIMULATED_DELAY);
  return categories.find((c) => c.slug === slug) ?? null;
}

// ─── Reviews ──────────────────────────────────────────────────────────────

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  await delay(SIMULATED_DELAY);
  return reviews.filter((r) => r.productId === productId);
}

// ─── Orders & User ────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  await delay(SIMULATED_DELAY);
  return mockOrders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(SIMULATED_DELAY);
  return mockOrders.find((o) => o.id === id) ?? null;
}

export async function getCurrentUser(): Promise<User> {
  await delay(SIMULATED_DELAY);
  return mockUser;
}

// ─── Promo Codes ──────────────────────────────────────────────────────────

const PROMO_CODES: PromoCode[] = [
  { code: 'SAVE10',   type: 'percentage', value: 10, isValid: true },
  { code: 'WELCOME20',type: 'percentage', value: 20, minOrder: 100, isValid: true },
  { code: 'FLAT15',   type: 'fixed',      value: 15, isValid: true },
];

export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  await delay(300);
  const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase());
  return promo ?? null;
}
