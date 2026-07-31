// ─── Core Product Types ────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  type: 'size' | 'color';
  value: string;
  label: string;
  inStock: boolean;
  priceModifier?: number; // added to base price
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;       // percentage off
  category: string;
  categorySlug: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
  sku: string;
}

// ─── Category ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  color: string;
}

// ─── Review ───────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;             // unique cart-item id
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  maxStock: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────

export interface WishlistItem {
  id?: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
  addedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Address {
  id: string;
  label: string;          // "Home", "Work", etc.
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ─── User / Account ───────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

// ─── Promo Code ───────────────────────────────────────────────────────────

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;           // percent or dollar amount
  minOrder?: number;
  expiresAt?: string;
  isValid: boolean;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

// ─── Checkout Form Types ───────────────────────────────────────────────────

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentFormData {
  method?: string;
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  saveCard?: boolean;
}

export type CheckoutStep = 'shipping' | 'payment' | 'review';
