import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, WishlistItem, PromoCode } from '@/types';
import { generateId } from '@/lib/utils';

interface CartSlice {
  cart: CartItem[];
  promoCode: PromoCode | null;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (promo: PromoCode | null) => void;
}

interface WishlistSlice {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isInWishlist: (productId: string) => boolean;
}

type StoreState = CartSlice & WishlistSlice;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ─── Cart State ───
      cart: [],
      promoCode: null,

      addToCart: (item, quantity = 1) => {
        const { cart } = get();
        // Check if item with same ID, size, and color already exists
        const existingIndex = cart.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.selectedSize === item.selectedSize &&
            i.selectedColor === item.selectedColor
        );

        if (existingIndex > -1) {
          const updatedCart = [...cart];
          const newQty = updatedCart[existingIndex].quantity + quantity;
          // Clamp quantity to max stock
          updatedCart[existingIndex].quantity = Math.min(newQty, item.maxStock);
          set({ cart: updatedCart });
        } else {
          const newCartItem: CartItem = {
            ...item,
            id: generateId('cart'),
            quantity: Math.min(quantity, item.maxStock),
          };
          set({ cart: [...cart, newCartItem] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateCartQuantity: (id, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [], promoCode: null });
      },

      applyPromoCode: (promoCode) => {
        set({ promoCode });
      },

      // ─── Wishlist State ───
      wishlist: [],

      addToWishlist: (item) => {
        const { wishlist } = get();
        if (!wishlist.some((i) => i.productId === item.productId)) {
          set({
            wishlist: [
              ...wishlist,
              { ...item, addedAt: new Date().toISOString() },
            ],
          });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          wishlist: get().wishlist.filter((item) => item.productId !== productId),
        });
      },

      toggleWishlist: (item) => {
        const { wishlist, addToWishlist, removeFromWishlist } = get();
        if (wishlist.some((i) => i.productId === item.productId)) {
          removeFromWishlist(item.productId);
        } else {
          addToWishlist(item);
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'ecommerce-store-storage', // key in localStorage
    }
  )
);
