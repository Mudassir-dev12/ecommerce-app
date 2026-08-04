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
            href={`https://wa.me/923192828729?text=${encodeURIComponent(`Hello! I am interested in wholesale / bulk purchase for "${product.name}". Please provide special discounted rates.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 rounded-[4px] bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            CHAT NOW
          </a>
        </div>
      </section>

      {/* ─── Product Details Section (Dynamic — shows only real entered data) ─── */}
      {(product.longDescription || product.description) && (
        <section className="space-y-8 border-t border-neutral-100 pt-10">

          {/* Section Header */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20]">Product Information</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">Product Details</h2>
            <div className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#B57A20] to-transparent" />
          </div>

          {/* Long Marketing Description (if entered) */}
          {product.longDescription && (
            <div className="rounded-[4px] bg-neutral-50 border border-neutral-200/60 p-6 text-sm text-neutral-700 leading-relaxed whitespace-pre-line max-w-4xl shadow-sm">
              {product.longDescription}
            </div>
          )}

          {/* Short Description / Product Details Block (exactly what the admin entered) */}
          {product.description && (
            <div className="rounded-[4px] bg-white border border-neutral-200/60 p-6 shadow-sm max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20] mb-4">Details &amp; Specifications</p>
              <pre className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans">
                {product.description}
              </pre>
            </div>
          )}

          {/* Available Colors (from actual DB variants) */}
          {colorVariants.length > 0 && (
            <div className="rounded-[4px] bg-white border border-neutral-200/60 p-5 shadow-sm max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20] mb-3">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map((c) => (
                  <span key={c.id} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 bg-neutral-100 px-3 py-1 rounded-[4px]">
                    <span
                      className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: c.value }}
                    />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

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
