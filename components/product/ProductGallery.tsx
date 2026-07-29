'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types';
import { cn } from '@/lib/utils';

export interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
        No image available
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Image Viewport */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100">
        
        {/* Zoomable Image frame */}
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
            sizes="(max-w-768px) 100vw, 600px"
            className={cn('object-cover object-center transition-transform duration-200 select-none', {
              'scale-150 duration-75': isZoomed,
            })}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Carousel slide controls (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-sm transition-all hover:bg-white active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative aspect-square w-20 overflow-hidden rounded-xl bg-neutral-50 border-2 transition-all shrink-0 hover:opacity-95',
                activeIndex === idx
                  ? 'border-primary-600 scale-[1.03] shadow-sm'
                  : 'border-transparent opacity-75'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || 'Thumbnail'}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
