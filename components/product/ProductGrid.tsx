import * as React from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  products: Product[];
  layout?: 'grid' | 'list';
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  layout = 'grid',
  isLoading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn({
          'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6': layout === 'grid',
          'flex flex-col gap-4 sm:gap-6': layout === 'list',
        })}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className={cn('rounded-2xl border border-neutral-100 bg-white p-4 shadow-card', {
              'aspect-[4/5] flex flex-col justify-between': layout === 'grid',
              'flex flex-col sm:flex-row gap-6 p-5': layout === 'list',
            })}
          >
            {layout === 'grid' ? (
              <div className="space-y-4 w-full">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                <Skeleton className="h-48 w-full sm:w-48 shrink-0 rounded-xl" />
                <div className="flex flex-col justify-between flex-1 gap-4 py-1">
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4 animate-pulse-slow">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">No products found</h3>
        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
          We couldn't find any products matching your search criteria. Try modifying your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn({
        'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6': layout === 'grid',
        'flex flex-col gap-4 sm:gap-6': layout === 'list',
      })}
    >
      {products.map((prod) => (
        <ProductCard key={prod.id} product={prod} layout={layout} />
      ))}
    </div>
  );
}
