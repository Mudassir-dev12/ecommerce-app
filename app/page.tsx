import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Percent, ShieldCheck, Zap } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSlider } from '@/components/home/HeroSlider';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* ─── Full-Screen Hero Banner Carousel (1.jpg, 2.jpg, 3.jpg) ───────── */}
      <HeroSlider />

      {/* ─── Category Grid Anchor Section ───────────────────────────────────── */}
      <section id="shop-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-6 scroll-mt-24">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Shop by Category</h2>
          <p className="text-sm text-neutral-600 max-w-md">Explore our luxury pret, unstitched, and designer collections.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-neutral-950 aspect-[3/4] p-4 text-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
            >
              {/* Background cover image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-w-768px) 30vw, 150px"
                className="object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500"
              />
              {/* Content overlay */}
              <div className="relative z-10 w-full">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest block mb-1">
                  {cat.productCount} Items
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {cat.name}
                </h3>
              </div>
              {/* Gradient card border on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Featured Products</h2>
            <p className="text-sm text-neutral-500">Handpicked items that represent our finest quality and design.</p>
          </div>
          <Link href="/products" className="group flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all">
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ─── Highlights / Features grid ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-100 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 mx-auto md:mx-0 shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Lightning-Fast Ordering</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Order in seconds with our optimized multi-step checkout experience. Easy, fast, secure.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 mx-auto md:mx-0 shadow-sm">
              <Percent className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Amazing Deals &amp; Discounts</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Regular promo codes, flash sales, and markdown prices on our curated clothing and electronics.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 mx-auto md:mx-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">100% Quality Guaranteed</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We source directly from premium brands to bring you genuine, certified items with support.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

