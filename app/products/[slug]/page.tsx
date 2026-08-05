import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getReviewsByProductId } from '@/lib/api';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { ProductPageWrapper } from './ProductPageWrapper';
import { ProductReviewsClient } from '@/components/product/ProductReviewsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: `${product.name} | Antigravity Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const reviews = await getReviewsByProductId(product.id);
  const colorVariants = (product.variants || []).filter((v) => v.type === 'color');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">

      {/* ─── Breadcrumbs ─── */}
      <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-neutral-500 truncate max-w-xs">{product.name}</span>
      </div>

      {/* ─── Main Detail Panel (Gallery + Details) ─── */}
      <div className="space-y-6">
        {/* Product header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600">
              {product.brand}
            </span>
            {product.isBestSeller && <Badge variant="warning">Best Seller</Badge>}
            {product.isNew && <Badge variant="primary">New Arrival</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <Rating rating={product.rating} showLabel reviewCount={product.reviewCount} size="md" />
          </div>
        </div>

        {/* Shared-state gallery + details wrapper */}
        <ProductPageWrapper product={product} />
      </div>

      {/* ─── Wholesale / Bulk Inquiry Section ─── */}
      <section className="rounded-[4px] bg-[#fff7f7] border border-[#800000]/20 p-5 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg sm:text-xl font-extrabold tracking-wider text-[#800000] uppercase">
              WHOLESALE / BULK INQUIRY
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Looking to buy in bulk? Get special discounted rates.
            </p>
          </div>
          <a
            href={`https://wa.me/923258865905?text=${encodeURIComponent(`Hello! I am interested in wholesale / bulk purchase for "${product.name}". Please provide special discounted rates.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3.5 px-6 py-3 bg-[#1fd260] hover:bg-[#1bc055] text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 shrink-0"
            style={{ borderRadius: '12px' }}
          >
            <svg className="h-10 w-10 text-white fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            <div className="flex flex-col items-start leading-[1.1] font-black text-sm tracking-wide">
              <span>CHAT</span>
              <span>NOW</span>
            </div>
          </a>
        </div>
      </section>

      {/* ─── Product Details Section (Dynamic — shows only real entered data) ─── */}
      {(product.description || product.longDescription) && (
        <section className="space-y-8 border-t border-neutral-100 pt-10">

          {/* Section Header */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20]">Product Information</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">Product Details</h2>
            <div className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#B57A20] to-transparent" />
          </div>

          {/* Product Details Block (displays the admin entered details) */}
          <div className="rounded-[4px] bg-white border border-neutral-200/60 p-6 shadow-sm max-w-4xl">
            <pre className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans">
              {product.description || product.longDescription}
            </pre>
          </div>
         </section>
      )}

      {/* ─── Customer Reviews Section ─── */}
      <ProductReviewsClient
        productId={product.id}
        initialReviews={reviews}
        initialRating={product.rating}
        initialReviewCount={product.reviewCount}
      />

      {/* ─── Related Products ─── */}
      <RelatedProducts product={product} />

    </div>
  );
}
