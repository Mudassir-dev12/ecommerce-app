'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw, Star } from 'lucide-react';
import type { Category } from '@/types';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current URL filters
  const activeCategory = searchParams.get('category') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeRating = searchParams.get('rating') || '';

  // Local state for price inputs to avoid laggy typing
  const [minPriceInput, setMinPriceInput] = React.useState(activeMinPrice);
  const [maxPriceInput, setMaxPriceInput] = React.useState(activeMaxPrice);

  // Sync inputs with URL changes (e.g., when reset)
  React.useEffect(() => {
    setMinPriceInput(activeMinPrice);
  }, [activeMinPrice]);

  React.useEffect(() => {
    setMaxPriceInput(activeMaxPrice);
  }, [activeMaxPrice]);

  // General URL update helper
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 when filters change
    params.set('page', '1');

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (slug: string) => {
    updateUrl({ category: activeCategory === slug ? null : slug });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
    });
  };

  const handleRatingSelect = (rating: number) => {
    const nextRating = activeRating === rating.toString() ? null : rating.toString();
    updateUrl({ rating: nextRating });
  };

  const handleReset = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    router.push('/products');
  };

  const isFiltered = activeCategory || activeMinPrice || activeMaxPrice || activeRating;

  return (
    <div className="space-y-8">
      
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Filters</h4>
        {isFiltered && (
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-neutral-900 text-xs font-semibold gap-1 px-2 h-8 rounded-lg"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </Button>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Category</h5>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  'flex items-center justify-between text-left text-sm py-1.5 px-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <span>{cat.name}</span>
                <span className={cn('text-xs text-neutral-400', isActive && 'text-primary-500')}>
                  {cat.productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Form */}
      <div className="space-y-3">
        <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Price Range (Rs.)</h5>
        <form onSubmit={handlePriceApply} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none"
            />
            <span className="text-neutral-400">—</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full h-9 text-xs">
            Apply Price
          </Button>
        </form>
      </div>

      {/* Rating Filters */}
      <div className="space-y-3">
        <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Customer Rating</h5>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => {
            const isActive = activeRating === stars.toString();
            return (
              <button
                key={`rating-filter-${stars}`}
                onClick={() => handleRatingSelect(stars)}
                className={cn(
                  'flex items-center gap-2 text-left text-sm py-1.5 px-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn('h-4 w-4', i < stars ? 'fill-current' : 'text-neutral-200')}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-500">& Up</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
