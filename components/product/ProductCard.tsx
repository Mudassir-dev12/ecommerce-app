'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatPrice, isVideoUrl } from '@/lib/utils';
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
      toast(`This item has options. Please select variants on details page.`, 'info');
      return;
    }

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
  const primaryIsVid = primaryImage ? isVideoUrl(primaryImage.url, primaryImage.isVideo) : false;
  const hoverIsVid = hoverImage ? isVideoUrl(hoverImage.url, hoverImage.isVideo) : false;

  if (layout === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-0 rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in-up">
        
        {/* Wishlist toggle */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            'absolute right-3 top-3 z-20 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/90 shadow-sm border border-neutral-100/60 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 focus:outline-none',
            isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
          )}
          aria-label="Wishlist toggle"
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Flush Thumbnail Box */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-square h-48 w-full sm:w-48 shrink-0 overflow-hidden bg-neutral-100"
        >
          {primaryIsVid ? (
            <video
              src={primaryImage.url}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className={cn(
                'h-full w-full object-cover object-top select-none pointer-events-none',
                !isAvailable && 'opacity-60 grayscale-[20%]'
              )}
            />
          ) : (
            <Image
              src={primaryImage?.url || ''}
              alt={primaryImage?.alt || product.name}
              fill
              sizes="(max-w-640px) 100vw, 200px"
              priority={product.isFeatured}
              className={cn(
                'object-cover object-top transition-opacity duration-500',
                hoverImage ? 'group-hover:opacity-0' : '',
                !isAvailable && 'opacity-60 grayscale-[20%]'
              )}
            />
          )}
          {hoverImage && !primaryIsVid && (
            hoverIsVid ? (
              <video
                src={hoverImage.url}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                className={cn(
                  'h-full w-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0 pointer-events-none',
                  !isAvailable && 'grayscale-[20%]'
                )}
              />
            ) : (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt || product.name}
                fill
                sizes="(max-w-640px) 100vw, 200px"
                className={cn(
                  'object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0',
                  !isAvailable && 'grayscale-[20%]'
                )}
              />
            )
          )}
          {!isAvailable ? (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
              SOLD OUT
            </span>
          ) : product.discount && product.discount > 0 ? (
            <Badge variant="danger" className="absolute left-3 top-3">
              -{product.discount}%
            </Badge>
          ) : null}
        </Link>

        {/* Padded Info Box */}
        <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-white">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 block">{product.category || product.brand}</span>
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed pt-0.5">{product.description}</p>
            <div className="flex items-center gap-1 pt-1.5">
              <Rating rating={product.rating || 4.8} size="sm" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1">
                {product.rating > 0 ? product.rating.toFixed(1) : '4.8'}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-normal">
                ({product.reviewCount || 45})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-neutral-100/80">
            <div className="flex items-baseline gap-2 min-w-0 shrink whitespace-nowrap">
              <span className="text-lg sm:text-xl font-black text-slate-900 whitespace-nowrap">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through whitespace-nowrap">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex gap-2">
              {!isAvailable ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="gap-1.5 font-bold text-rose-600 bg-rose-50 border-rose-200 cursor-not-allowed opacity-80 rounded-xl"
                >
                  Sold Out
                </Button>
              ) : (
                <button
                  onClick={handleAddToCartClick}
                  className="h-8.5 px-4 text-xs font-bold gap-1.5 rounded-xl bg-[#B57A20] hover:bg-[#8e5c12] text-white shadow-sm inline-flex items-center justify-center transition-all transform active:scale-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-white" />
                  <span>Add</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Grid layout (default) matching reference image — 100% Flush Top/Left/Right Image (No Gap)
  return (
    <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in-up">
      <div className="flex flex-col flex-1">
        {/* Wishlist Button (Top-Right Floating Circular White Badge) */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            'absolute right-3 top-3 z-20 flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-full bg-white/90 shadow-sm border border-neutral-100/60 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 focus:outline-none',
            isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
          )}
          aria-label="Wishlist toggle"
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Flush Top Image Box — NO padding, 100% flush to top, left, and right borders */}
        <div className="relative block aspect-square w-full bg-neutral-100 overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            {primaryIsVid ? (
              <video
                src={primaryImage.url}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                className={cn(
                  'h-full w-full object-cover object-top select-none pointer-events-none',
                  !isAvailable && 'opacity-60 grayscale-[20%]'
                )}
              />
            ) : (
              <Image
                src={primaryImage?.url || ''}
                alt={primaryImage?.alt || product.name}
                fill
                sizes="(max-w-768px) 50vw, (max-w-1200px) 33vw, 300px"
                priority={product.isFeatured}
                className={cn(
                  'object-cover object-top transition-opacity duration-500',
                  hoverImage ? 'group-hover:opacity-0' : '',
                  !isAvailable && 'opacity-60 grayscale-[20%]'
                )}
              />
            )}
            {hoverImage && !primaryIsVid && (
              hoverIsVid ? (
                <video
                  src={hoverImage.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className={cn(
                    'h-full w-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0 pointer-events-none',
                    !isAvailable && 'grayscale-[20%]'
                  )}
                />
              ) : (
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.alt || product.name}
                  fill
                  sizes="(max-w-768px) 50vw, (max-w-1200px) 33vw, 300px"
                  className={cn(
                    'object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0',
                    !isAvailable && 'grayscale-[20%]'
                  )}
                />
              )
            )}
          </Link>

          {!isAvailable ? (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
              SOLD OUT
            </span>
          ) : product.discount && product.discount > 0 ? (
            <Badge variant="danger" className="absolute left-2.5 top-2.5 text-[10px] sm:text-xs">
              -{product.discount}%
            </Badge>
          ) : null}
        </div>

        {/* Product Meta Info — Padded section below flush image */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
          <div className="space-y-1">
            {/* Category */}
            <span className="text-[12px] font-medium text-slate-400 block truncate">
              {product.category || product.brand}
            </span>

            {/* Title (2 lines clamp) */}
            <Link href={`/products/${product.slug}`} className="block">
              <h3
                className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[2.5rem]"
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-1 pt-0.5">
              <Rating rating={product.rating || 4.8} size="sm" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1">
                {product.rating > 0 ? product.rating.toFixed(1) : '4.8'}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-normal">
                ({product.reviewCount || 45})
              </span>
            </div>
          </div>

          {/* Footer: Price & Add Button */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-1 shrink-0">
            <div className="flex flex-col justify-center min-w-0 shrink whitespace-nowrap">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 whitespace-nowrap">
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] sm:text-xs text-slate-400 line-through whitespace-nowrap">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0">
              {!isAvailable ? (
                <button
                  disabled
                  className="h-8 px-3 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 cursor-not-allowed opacity-80 rounded-xl"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleAddToCartClick}
                  disabled={!isAvailable}
                  className="h-8 sm:h-8.5 px-3.5 text-xs font-bold gap-1.5 rounded-xl bg-[#B57A20] hover:bg-[#8e5c12] text-white shadow-sm inline-flex items-center justify-center transition-all transform active:scale-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-white" />
                  <span>Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
