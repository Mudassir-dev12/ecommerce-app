'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CreditCard, Heart, Minus, Plus } from 'lucide-react';
import type { Product, WishlistItem } from '@/types';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, applyDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ProductClientDetailsProps {
  product: Product;
  /** Called with the image index to switch when user picks a color */
  onColorSelect?: (imageIndex: number) => void;
}

export function ProductClientDetails({ product, onColorSelect }: ProductClientDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist(product.id));

  const isAvailable = Boolean(product.inStock) && Number(product.stockCount || 0) > 0;

  // Extract variants by type
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const sizeVariants = product.variants.filter((v) => v.type === 'size');

  // Selected variant state
  const [selectedColor, setSelectedColor] = React.useState(
    colorVariants.length > 0 ? colorVariants[0].value : undefined
  );
  const [selectedSize, setSelectedSize] = React.useState(
    sizeVariants.length > 0 ? sizeVariants[0].value : undefined
  );

  // Quantity stepper state
  const [quantity, setQuantity] = React.useState(1);

  // Price calculations based on selected variants
  const activeColorObject = colorVariants.find((c) => c.value === selectedColor);
  const activeSizeObject = sizeVariants.find((s) => s.value === selectedSize);

  const priceModifier =
    (activeColorObject?.priceModifier || 0) + (activeSizeObject?.priceModifier || 0);

  const basePrice = product.price + priceModifier;
  const currentPrice = basePrice;
  const originalPrice = product.originalPrice
    ? product.originalPrice + priceModifier
    : undefined;

  const handleQtyChange = (val: number) => {
    const nextQty = quantity + val;
    if (nextQty >= 1 && nextQty <= (product.stockCount || 0)) {
      setQuantity(nextQty);
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast('This product is currently out of stock.', 'error');
      return;
    }

    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: currentPrice,
        image: product.images[0]?.url || '',
        selectedColor: activeColorObject?.label,
        selectedSize: activeSizeObject?.label,
        maxStock: product.stockCount,
      },
      quantity
    );

    toast(`Successfully added ${quantity} item(s) to your cart.`, 'success');
  };

  const handleBuyNow = () => {
    if (!isAvailable) {
      toast('This product is currently out of stock.', 'error');
      return;
    }

    // Add item and go directly to checkout
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: currentPrice,
        image: product.images[0]?.url || '',
        selectedColor: activeColorObject?.label,
        selectedSize: activeSizeObject?.label,
        maxStock: product.stockCount,
      },
      quantity
    );

    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0]?.url || '',
      rating: product.rating,
      inStock: isAvailable,
    });

    toast(
      isInWishlist
        ? `Removed "${product.name}" from wishlist.`
        : `Added "${product.name}" to wishlist.`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      
      {!isAvailable && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-rose-700 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
          <span>This product is currently SOLD OUT and no longer available for purchase.</span>
        </div>
      )}

      {/* ─── Price Section ─── */}
      <div className="flex items-baseline gap-3 border-y border-neutral-100 py-4">
        <span className="text-3xl font-extrabold text-neutral-900">{formatPrice(currentPrice)}</span>
        {originalPrice && originalPrice > currentPrice && (
          <span className="text-lg text-neutral-400 line-through">{formatPrice(originalPrice)}</span>
        )}
        {product.discount && (
          <Badge variant="danger" className="text-xs py-1">
            Save {product.discount}%
          </Badge>
        )}
      </div>

      {/* ─── Color Variant Selection ─── */}
      {colorVariants.length > 0 && (
        <div className="space-y-3 bg-[#FAF6F0]/60 border border-[#e7dccb]/80 p-4 rounded-2xl">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-neutral-500 uppercase tracking-wider text-xs font-bold flex items-center gap-1.5">
              <span>Select Color:</span>
              <span className="text-[#B57A20] font-extrabold text-sm">{activeColorObject?.label || 'Select a Color'}</span>
            </span>
            <span className="text-xs text-neutral-400 font-normal">
              {colorVariants.length} Color Options Available
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {colorVariants.map((col, colIdx) => {
              const isSelected = selectedColor === col.value;
              const isHexColor = col.value && (col.value.startsWith('#') || col.value.startsWith('rgb'));
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    setSelectedColor(col.value);
                    // Switch gallery image to the image at this color's index (clamped to available images)
                    onColorSelect?.(colIdx);
                  }}
                  className={cn(
                    'group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all focus:outline-none active:scale-95 shadow-sm',
                    isSelected
                      ? 'border-[#B57A20] bg-white ring-2 ring-[#B57A20] ring-offset-1 text-[#131213] font-bold shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-[#FAF6F0]'
                  )}
                  title={col.label}
                  aria-label={col.label}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-neutral-300 shadow-inner shrink-0"
                    style={{ backgroundColor: isHexColor ? col.value : '#9E7B9B' }}
                  />
                  <span className="text-xs font-semibold">{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Size Variant Selection ─── */}
      {sizeVariants.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-neutral-500 uppercase tracking-wider text-xs">Size</span>
            <span className="text-neutral-900">{activeSizeObject?.label}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {sizeVariants.map((sz) => {
              const isSelected = selectedSize === sz.value;
              return (
                <button
                  key={sz.id}
                  onClick={() => setSelectedSize(sz.value)}
                  disabled={!sz.inStock || !isAvailable}
                  className={cn(
                    'flex h-10 min-w-10 items-center justify-center rounded-lg border text-sm font-bold transition-all px-3.5 focus:outline-none disabled:opacity-30 disabled:pointer-events-none active:scale-95',
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                  )}
                >
                  {sz.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Quantity Controls & Stock Indicators ─── */}
      <div className="space-y-2">
        <span className="text-neutral-500 uppercase tracking-wider text-xs font-semibold block">Quantity</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1 shrink-0">
            <button
              onClick={() => handleQtyChange(-1)}
              disabled={!isAvailable || quantity <= 1}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4.5 w-4.5" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-neutral-800">
              {isAvailable ? quantity : 0}
            </span>
            <button
              onClick={() => handleQtyChange(1)}
              disabled={!isAvailable || quantity >= product.stockCount}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded"
              aria-label="Increase quantity"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
          </div>
          
          {/* Stock badge */}
          <div>
            {isAvailable ? (
              <span className="text-xs font-semibold text-emerald-600">
                In Stock ({product.stockCount} available)
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded px-2.5 py-1">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Call to Actions (Add to Cart & Buy Now - Larger Height & Text Stack) ─── */}
      <div className="flex flex-col gap-3.5 pt-4 border-t border-neutral-100">
        {/* Add to Cart Button (Top Pill) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full h-14 sm:h-15 rounded-full border-2 border-[#B57A20]/50 bg-[#FAF6F0] hover:bg-[#F3E7D5] text-[#B57A20] font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-5 w-5 text-[#B57A20]" />
          <span>{isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>

        {/* Buy It Now Button (Bottom Pill) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!isAvailable}
          className="w-full h-14 sm:h-15 rounded-full bg-[#B57A20] hover:bg-[#8e5c12] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          <CreditCard className="h-5 w-5 text-white" />
          <span>{isAvailable ? 'Buy It Now' : 'Sold Out'}</span>
        </button>
      </div>

    </div>
  );
}
