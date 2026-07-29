'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface ProductSortProps {
  currentSort: string;
}

export function ProductSort({ currentSort }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', nextSort);
    params.set('page', '1'); // Reset pagination to page 1 when sort changes
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-750 focus:outline-none cursor-pointer"
    >
      <option value="featured">Featured</option>
      <option value="popularity">Popularity</option>
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Rating</option>
    </select>
  );
}
