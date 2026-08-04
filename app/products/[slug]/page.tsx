import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck, Truck, Sparkles, Gem, Scissors, Wind, Star, Package
} from 'lucide-react';
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

  // Parse color variant names for spec table
  const colorVariants = (product.variants || []).filter((v) => v.type === 'color');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">

      {/* ─── Breadcrumbs ─── */}
      <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-neutral-500 truncate max-w-xs">{product.name}</span>
      </div>

      {/* ─── Detail Panel (Gallery + Client Details) ─── */}
      <div className="space-y-6">
        {/* Product header (brand / badges / title / rating) */}
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

        {/* Shared-state gallery + details wrapper (client component) */}
        <ProductPageWrapper product={product} />
      </div>

      {/* ─── Product Overview (Luxury Redesign) ─── */}
      <section className="space-y-10 border-t border-neutral-100 pt-14">

        {/* Section Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20]">Craftsmanship & Detail</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">Product Overview</h2>
          <div className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#B57A20] to-transparent" />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Sparkles, title: 'Embroidered', desc: 'Intricate front embroidery with fine threadwork' },
            { icon: Gem,       title: 'Premium Fabric', desc: 'Luxurious lawn / chiffon blend for a graceful drape' },
            { icon: Scissors,  title: 'Front Open Style', desc: 'Elegant front-open silhouette with detailed hem' },
            { icon: Wind,      title: 'Airy & Light', desc: 'Breathable weave — perfect for all-day comfort' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col gap-3 rounded-2xl border border-[#e7dccb]/70 bg-gradient-to-br from-[#FAF6F0] to-white p-5 shadow-sm hover:shadow-md hover:border-[#B57A20]/40 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B57A20]/10 text-[#B57A20] group-hover:bg-[#B57A20]/20 transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-neutral-800 text-sm">{title}</p>
                <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description Text */}
        {(product.longDescription || product.description) && (
          <div className="rounded-2xl bg-[#FAF6F0]/60 border border-[#e7dccb]/60 p-6 text-sm text-neutral-700 leading-relaxed whitespace-pre-line max-w-4xl">
            {product.longDescription || product.description}
          </div>
        )}

        {/* Spec Table + Color Chips (side by side on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Specifications Table */}
          <div className="rounded-2xl border border-[#e7dccb]/70 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#B57A20] to-[#d4a344] px-5 py-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white">Product Specifications</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: 'Style', value: 'Front Open Suit' },
                  { label: 'Work', value: 'Embroidered' },
                  { label: 'Sleeves', value: 'Full Sleeves' },
                  { label: 'Length', value: 'Maxi / Floor Length' },
                  { label: 'Size', value: 'Standard (Unstitched)' },
                  { label: 'Occasion', value: 'Festive / Semi-Formal' },
                  { label: 'Colors', value: colorVariants.length > 0 ? colorVariants.map(c => c.label).join(', ') : '—' },
                ].map(({ label, value }, i) => (
                  <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F0]/60'}>
                    <td className="px-5 py-3 font-semibold text-neutral-500 w-2/5">{label}</td>
                    <td className="px-5 py-3 text-neutral-800 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Care + Trust Badges */}
          <div className="flex flex-col gap-4">

            {/* Care Instructions */}
            <div className="rounded-2xl border border-[#e7dccb]/70 bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20]">Care Instructions</p>
              <ul className="space-y-2 text-sm text-neutral-600">
                {[
                  '🧺  Gentle machine wash / hand wash in cold water',
                  '🚫  Do not bleach or tumble dry',
                  '🌿  Dry in shade to preserve color vibrancy',
                  '♨️  Iron on medium heat from reverse side',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 leading-snug">{line}</li>
                ))}
              </ul>
            </div>

            {/* Trust Badges Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: '100% Authentic', sub: 'Original fabric' },
                { icon: Truck,       label: 'Fast Delivery', sub: 'Nationwide' },
                { icon: Star,        label: 'Premium Quality', sub: 'Assured craftsmanship' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#e7dccb]/60 bg-[#FAF6F0]/60 p-3 text-center shadow-sm"
                >
                  <Icon className="h-5 w-5 text-[#B57A20]" />
                  <p className="text-xs font-bold text-neutral-800 leading-tight">{label}</p>
                  <p className="text-[10px] text-neutral-400 leading-snug">{sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Wholesale / Bulk Inquiry Section ─── */}
      <section className="rounded-2xl border border-[#800000]/30 bg-[#fff7f7] p-5 sm:p-6 md:p-8 transition-all hover:border-[#800000]/60 shadow-sm">
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
            className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            CHAT NOW
          </a>
        </div>
      </section>

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
