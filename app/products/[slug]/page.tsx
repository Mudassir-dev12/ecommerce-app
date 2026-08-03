import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, RotateCcw, AlertCircle } from 'lucide-react';
import { getProductBySlug, getReviewsByProductId } from '@/lib/api';
import { ProductGallery } from '@/components/product/ProductGallery';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { ProductClientDetails } from './ProductClientDetails';
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* ─── Breadcrumbs ─── */}
      <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-neutral-500 truncate max-w-xs">{product.name}</span>
      </div>

      {/* ─── Detail Splitted Panel ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Images Gallery */}
        <div>
          <ProductGallery images={product.images} product={product} />
        </div>

        {/* Right Side: Options and Cart Actions (Client Component) */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
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

          <ProductClientDetails product={product} />
        </div>

      </div>

      {/* ─── Long Description ─── */}
      <section className="border-t border-neutral-150 pt-12 space-y-4">
        <h3 className="text-xl font-bold text-neutral-900">Product Overview</h3>
        <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line max-w-4xl">
          {product.longDescription || product.description}
        </p>
      </section>

      {/* ─── Wholesale / Bulk Inquiry Section (Directly After Product Overview) ─── */}
      <section className="rounded-2xl border border-[#800000]/30 bg-[#fff7f7] p-5 sm:p-6 md:p-8 transition-all hover:border-[#800000]/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-lg sm:text-xl font-extrabold tracking-wider text-[#800000] uppercase">
              WHOLESALE / BULK INQUIRY
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Looking to buy in bulk? Get special discounted rates.
            </p>
          </div>

          <a
            href={`https://wa.me/923192828729?text=${encodeURIComponent(`Hello! I am interested in wholesale / bulk purchase for "${product.name}". Please provide special discounted rates.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            CHAT NOW
          </a>
        </div>
      </section>

      {/* ─── Customer Reviews Section (Dynamic Supabase Backend) ─── */}
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
