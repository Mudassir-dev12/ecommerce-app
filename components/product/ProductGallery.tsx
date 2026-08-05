'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { Product, ProductImage } from '@/types';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

export interface ProductGalleryProps {
  images: ProductImage[];
  product?: Product;
  /** Controlled active index – driven by parent when colors are linked */
  activeIndex?: number;
  /** Notify parent of index changes (arrows / thumbnails) */
  onIndexChange?: (idx: number) => void;
}

export function ProductGallery({
  images,
  product,
  activeIndex: controlledIndex,
  onIndexChange,
}: ProductGalleryProps) {
  const { toast } = useToast();
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist(product?.id || ''));

  // Internal index when component is uncontrolled
  const [internalIndex, setInternalIndex] = React.useState(0);

  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const setActiveIndex = React.useCallback(
    (idx: number) => {
      if (isControlled) {
        onIndexChange?.(idx);
      } else {
        setInternalIndex(idx);
      }
    },
    [isControlled, onIndexChange]
  );

  const [isZoomed, setIsZoomed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
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
      isInWishlist
        ? `Removed "${product.name}" from wishlist.`
        : `Added "${product.name}" to wishlist.`,
      'info'
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
        No image available
      </div>
    );
  }

  const handleNext = () => {
    const next = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(next);
  };

  const handlePrev = () => {
    const prev = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(prev);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];

  return (
    <div className="flex flex-col gap-4 w-full">

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-md border border-neutral-200 bg-white">

        {/* Floating Wishlist Heart Icon */}
        {product && (
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute right-4 top-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-transform hover:scale-110 active:scale-95 focus:outline-none',
              isInWishlist ? 'text-rose-500' : 'text-neutral-700 hover:text-rose-500'
            )}
            title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className="h-6 w-6 sm:h-7 sm:w-7" fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Zoomable Image frame — object-cover fills canvas edge-to-edge, anchored to top */}
        <div
          className="relative h-full w-full cursor-zoom-in overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage.url}
            alt={activeImage.alt || 'Product image'}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 700px"
            className={cn(
              'object-cover object-top select-none transition-transform duration-200',
              { 'scale-150 duration-75': isZoomed }
            )}
            style={
              isZoomed
                ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                : undefined
            }
          />
        </div>

        {/* Carousel controls (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative aspect-[3/4] h-20 sm:h-24 overflow-hidden rounded-xl border-2 transition-all shrink-0 hover:opacity-95',
                safeIndex === idx
                  ? 'border-[#131213] scale-[1.03] shadow-md ring-1 ring-[#131213]'
                  : 'border-neutral-200 opacity-70'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || 'Thumbnail'}
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
