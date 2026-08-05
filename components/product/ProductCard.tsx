'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { useToast } from '../ui/Toast';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist(product.id));

  const hasVariants = product.variants.length > 0;
  const isWishlisted = isInWishlist;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0]?.url || '',
      rating: product.rating,
      inStock: product.inStock,
    });
    toast(
      isWishlisted
        ? `Removed "${product.name}" from wishlist.`
        : `Added "${product.name}" to wishlist.`,
      'info'
    );
  };

  const isAvailable = product.inStock && product.stockCount > 0;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAvailable) {
      toast('Sorry, this product is currently out of stock.', 'error');
      return;
    }

    if (hasVariants) {
      // Direct them to pick options
      toast(`This item has options. Please select variants on details page.`, 'info');
      return;
    }

    // Default parameters if no variants
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0]?.url || '',
      maxStock: product.stockCount,
    });
    toast(`Added "${product.name}" to your shopping cart.`, 'success');
  };

  // Image calculations
  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
  const hoverImage = product.images.length > 1 ? product.images[1] : null;

  if (layout === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-6 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card hover:shadow-card-hover transition-card hover-lift animate-fade-in-up">
        
        {/* Wishlist toggle absolute */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            'absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-all hover:scale-105 active:scale-95',
            isWishlisted ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-600'
          )}
          aria-label="Wishlist toggle"
        >
          <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Thumbnail Box */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-[3/4] h-48 w-36 sm:w-40 shrink-0 overflow-hidden rounded-xl bg-neutral-50 p-1 flex items-center justify-center border border-neutral-100"
        >
          <Image
            src={primaryImage?.url || ''}
            alt={primaryImage?.alt || product.name}
            fill
            sizes="(max-w-640px) 100vw, 160px"
            priority={product.isFeatured}
            className={cn(
              'object-cover object-top transition-opacity duration-500 rounded-lg',
              hoverImage ? 'group-hover:opacity-0' : '',
              !isAvailable && 'opacity-60 grayscale-[20%]'
            )}
          />
          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt={hoverImage.alt || product.name}
              fill
              sizes="(max-w-640px) 100vw, 160px"
              className={cn(
                'object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0 rounded-lg',
                !isAvailable && 'grayscale-[20%]'
              )}
            />
          )}
          {!isAvailable ? (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
              SOLD OUT
            </span>
          ) : product.discount && product.discount > 0 ? (
            <Badge variant="danger" className="absolute left-3 top-3">
              -{product.discount}%
            </Badge>
          ) : product.isNew ? (
            <Badge variant="primary" className="absolute left-3 top-3">
              New
            </Badge>
          ) : null}
        </Link>

        {/* Product Meta */}
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{product.brand}</span>
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2 pt-1">
              <Rating rating={product.rating} showLabel reviewCount={product.reviewCount} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-auto">
            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-neutral-900">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-2">
              {!isAvailable ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="gap-1.5 font-bold text-rose-600 bg-rose-50 border-rose-200 cursor-not-allowed opacity-80"
                >
                  Sold Out
                </Button>
              ) : hasVariants ? (
                <Link href={`/products/${product.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>Options</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleAddToCartClick}
                  variant="primary"
                  size="sm"
                  disabled={!isAvailable}
                  className="gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-card hover:shadow-card-hover transition-card hover-lift animate-fade-in-up">
      <div className="flex flex-col flex-1">
        {/* Wishlist toggle (Icon only, no bg circle) */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            'absolute right-4 top-4 z-20 p-1.5 transition-transform hover:scale-125 active:scale-95 drop-shadow-md focus:outline-none',
            isWishlisted ? 'text-rose-500' : 'text-neutral-600 hover:text-rose-500'
          )}
          aria-label="Wishlist toggle"
        >
          <Heart className="h-5.5 w-5.5 sm:h-6 sm:w-6" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Thumbnail Box (3:4 Portrait Canvas to prevent dress image top/bottom cropping) */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-50 p-1 border border-neutral-100"
        >
          <Image
            src={primaryImage?.url || ''}
            alt={primaryImage?.alt || product.name}
            fill
            sizes="(max-w-768px) 50vw, (max-w-1200px) 33vw, 300px"
            priority={product.isFeatured}
            className={cn(
              'object-cover object-top transition-opacity duration-500 rounded-lg',
              hoverImage ? 'group-hover:opacity-0' : '',
              !isAvailable && 'opacity-60 grayscale-[20%]'
            )}
          />
          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt={hoverImage.alt || product.name}
              fill
              sizes="(max-w-768px) 50vw, (max-w-1200px) 33vw, 300px"
              className={cn(
                'object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0 rounded-lg',
                !isAvailable && 'grayscale-[20%]'
              )}
            />
          )}
          {!isAvailable ? (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
              SOLD OUT
            </span>
          ) : product.discount && product.discount > 0 ? (
            <Badge variant="danger" className="absolute left-2.5 top-2.5 text-[10px] sm:text-xs">
              -{product.discount}%
            </Badge>
          ) : product.isNew ? (
            <Badge variant="primary" className="absolute left-2.5 top-2.5 text-[10px] sm:text-xs">
              New
            </Badge>
          ) : null}
        </Link>

        {/* Product Meta (Increased Text Sizes) */}
        <div className="mt-3.5 space-y-1.5 flex-1 flex flex-col justify-start">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block truncate">
            {product.brand}
          </span>
          <Link href={`/products/${product.slug}`} className="block">
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors truncate max-w-full"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center pt-0.5">
            <Rating rating={product.rating} size="sm" />
            <span className="text-xs text-neutral-400 ml-1.5 font-semibold">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Footer: Price & CTA buttons cleanly aligned at bottom */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-100/80 shrink-0">
        {/* Prices (Single Line Guaranteed with Larger Font) */}
        <div className="flex flex-col min-w-0 shrink">
          <span className="text-sm sm:text-base font-black text-neutral-900 whitespace-nowrap tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through whitespace-nowrap">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* CTAs (Matching Screenshot Pill Buttons) */}
        <div className="shrink-0">
          {!isAvailable ? (
            <button
              disabled
              className="h-8 sm:h-8.5 px-3.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 cursor-not-allowed opacity-80 rounded-full"
            >
              Sold Out
            </button>
          ) : hasVariants ? (
            <Link href={`/products/${product.slug}`}>
              <button className="h-8 sm:h-8.5 px-3.5 text-xs font-extrabold rounded-full border border-[#131213] text-[#131213] hover:bg-neutral-50 transition-all">
                Options
              </button>
            </Link>
          ) : (
            <button
              onClick={handleAddToCartClick}
              disabled={!isAvailable}
              className="h-8 sm:h-8.5 px-3.5 text-xs font-extrabold gap-1.5 rounded-full bg-[#B57A20] hover:bg-[#8e5c12] text-white shadow-sm inline-flex items-center justify-center transition-all transform active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-white" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
