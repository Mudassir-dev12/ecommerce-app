'use client';

import * as React from 'react';
import type { Product } from '@/types';
import { ProductGrid } from './ProductGrid';

interface ProductGridWrapperProps {
  products: Product[];
  layout?: 'grid' | 'list';
}

export function ProductGridWrapper({ products, layout = 'grid' }: ProductGridWrapperProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5 sec skeleton loading
    return () => clearTimeout(timer);
  }, [products, layout]);

  return <ProductGrid products={products} layout={layout} isLoading={isLoading} skeletonCount={8} />;
}
