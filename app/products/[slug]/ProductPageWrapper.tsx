'use client';

import * as React from 'react';
import type { Product } from '@/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductClientDetails } from './ProductClientDetails';

interface ProductPageWrapperProps {
  product: Product;
}

export function ProductPageWrapper({ product }: ProductPageWrapperProps) {
  // activeImageIndex is controlled here so color swatches can drive gallery image
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      {/* Left Side: Images Gallery */}
      <div>
        <ProductGallery
          images={product.images}
          product={product}
          activeIndex={activeImageIndex}
          onIndexChange={setActiveImageIndex}
        />
      </div>

      {/* Right Side: Options and Cart Actions */}
      <ProductClientDetails
        product={product}
        onColorSelect={setActiveImageIndex}
      />
    </div>
  );
}
