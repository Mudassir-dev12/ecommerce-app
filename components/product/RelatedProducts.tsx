'use client';

import * as React from 'react';
import type { Product } from '@/types';
import { getRelatedProducts } from '@/lib/api';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';

export interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const [related, setRelated] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadRelated() {
      setIsLoading(true);
      try {
        const data = await getRelatedProducts(product, 4);
        setRelated(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRelated();
  }, [product]);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="border-t border-neutral-100 pt-12">
        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">You might also like</h3>
        <p className="text-sm text-neutral-500 mt-1">Recommended products based on this category</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-card">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 animate-fade-in">
          {related.map((prod) => (
            <ProductCard key={prod.id} product={prod} layout="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
