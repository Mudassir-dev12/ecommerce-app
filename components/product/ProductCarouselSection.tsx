'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  categorySlug?: string;
  products: Product[];
  autoPlayInterval?: number;
}

export function ProductCarouselSection({
  title,
  subtitle,
  categorySlug,
  products,
  autoPlayInterval = 2800,
}: ProductCarouselSectionProps) {
  const n = products?.length || 0;

  // Tripled items array for seamless infinite sliding
  const displayItems = React.useMemo(() => {
    if (!products || n === 0) return [];
    return [...products, ...products, ...products];
  }, [products, n]);

  const [currentIndex, setCurrentIndex] = React.useState(n);
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  if (!products || n === 0) return null;

  // Slide Left to Right (decrements index)
  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Slide Right to Left (increments index)
  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Handle seamless infinite loop jump on transition end
  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + n);
    } else if (currentIndex >= n * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - n);
    }
  };

  // Auto-slide Right-to-Left with reduced delay (2.8s)
  React.useEffect(() => {
    if (isHovered || n === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isHovered, n, autoPlayInterval]);

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Heading */}
      <div className="flex justify-between items-center border-b border-[#e7dccb]/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#131213] uppercase tracking-wider">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {categorySlug && (
          <Link
            href={`/products?category=${categorySlug}`}
            className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#B57A20] hover:text-[#8e5c12] transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Product Section Wrapper with Left & Right Side Navigation Buttons */}
      <div className="relative group/carousel px-2 sm:px-4">
        {/* Left Side Button (<) */}
        <button
          onClick={handlePrev}
          aria-label="Scroll Left"
          className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-800 shadow-xl hover:bg-[#B57A20] hover:text-white hover:border-[#B57A20] transition-all duration-300 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Right Side Button (>) */}
        <button
          onClick={handleNext}
          aria-label="Scroll Right"
          className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-800 shadow-xl hover:bg-[#B57A20] hover:text-white hover:border-[#B57A20] transition-all duration-300 active:scale-95"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Continuous Horizontal Slide Track */}
        <div className="overflow-hidden w-full py-2">
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex flex-nowrap transition-transform duration-500 ease-in-out"
            style={{
              transform: `translate3d(-${currentIndex * 25}%, 0, 0)`,
              transitionProperty: isTransitioning ? 'transform' : 'none',
            }}
          >
            {displayItems.map((prod, idx) => (
              <div
                key={`${prod.id}-${idx}`}
                className="w-1/2 sm:w-1/2 lg:w-1/4 shrink-0 px-2 sm:px-3"
              >
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
