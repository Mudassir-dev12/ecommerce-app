import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Percent, ShieldCheck, Zap } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/api';
import { HeroScrollBanners } from '@/components/home/HeroScrollBanners';
import { ProductCarouselSection } from '@/components/product/ProductCarouselSection';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [productsRes, categories] = await Promise.all([
    getProducts({}, 'featured', 1, 30),
    getCategories(),
  ]);

  const products = productsRes.products || [];

  // Group dynamic products for distinct category sliders
  const section1Products = products.length > 0 ? products : [];
  const section2Products = products.length >= 4 ? [...products.slice(4), ...products.slice(0, 4)] : products;
  const section3Products = products.length >= 8 ? [...products.slice(8), ...products.slice(0, 8)] : products;
  const section4Products = products.length >= 2 ? [...products.slice(2), ...products.slice(0, 2)] : products;
  const section5Products = products.length >= 6 ? [...products.slice(6), ...products.slice(0, 6)] : products;

  // Category labels dynamically derived from fetched categories
  const cat1 = categories[0] || { name: 'Pret Collection', slug: 'pret' };
  const cat2 = categories[1] || { name: 'Unstitched', slug: 'unstitched' };
  const cat3 = categories[2] || { name: 'Luxury Fragrances', slug: 'him' };

  return (
    <div className="space-y-16 pb-16">
      
      {/* ─── Full-Screen Vertical Scroll Banners ───────────────────────────── */}
      <HeroScrollBanners />


      {/* ─── Product Carousel #1 (After Categories) ───────────────────────── */}
      <ProductCarouselSection
        title={`${cat1.name} Collection`}
        subtitle="Explore our finest handpicked fashion items"
        categorySlug={cat1.slug}
        products={section1Products}
        autoPlayInterval={3500}
      />

      {/* ─── Banner 1 (7.png) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/7.png"
              alt="Luxury Edition - 7"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Product Carousel #2 (After Banner 1) ───────────────────────── */}
      <ProductCarouselSection
        title={`${cat2.name} Collection`}
        subtitle="Premium unstitched & designer wear"
        categorySlug={cat2.slug}
        products={section2Products}
        autoPlayInterval={4000}
      />

      {/* ─── Banner 2 (8.png) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/8.png"
              alt="Luxury Collection - 8"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Product Carousel #3 (After Banner 2) ───────────────────────── */}
      <ProductCarouselSection
        title={`${cat3.name} Collection`}
        subtitle="Exclusive signature items & luxury arrivals"
        categorySlug={cat3.slug}
        products={section3Products}
        autoPlayInterval={4500}
      />

      {/* ─── Banner 3 (9.png) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/9.png"
              alt="Luxury Arrival - 9"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Product Carousel #4 (After Banner 3) ───────────────────────── */}
      <ProductCarouselSection
        title="Trending Festive Wear"
        subtitle="Handcrafted couture & embroidered masterpieces"
        categorySlug="all"
        products={section4Products}
        autoPlayInterval={3800}
      />

      {/* ─── Banner 4 (10.png) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/10.png"
              alt="Couture Series - 10"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Product Carousel #5 (After Banner 4) ───────────────────────── */}
      <ProductCarouselSection
        title="Luxury Signature Editions"
        subtitle="Premium new releases & seasonal highlights"
        categorySlug="all"
        products={section5Products}
        autoPlayInterval={4200}
      />

      {/* ─── Highlights / Features grid ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="rounded-[4px] bg-white border border-neutral-200 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left shadow-sm">
          <div className="space-y-3 hover-lift p-2 rounded-[4px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-white text-primary-600 mx-auto md:mx-0 shadow-sm border border-neutral-100">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Lightning-Fast Ordering</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Order in seconds with our optimized multi-step checkout experience. Easy, fast, secure.
            </p>
          </div>
          <div className="space-y-3 hover-lift p-2 rounded-[4px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-white text-primary-600 mx-auto md:mx-0 shadow-sm border border-neutral-100">
              <Percent className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Amazing Deals &amp; Discounts</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Regular promo codes, flash sales, and markdown prices on our curated clothing and electronics.
            </p>
          </div>
          <div className="space-y-3 hover-lift p-2 rounded-[4px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-white text-primary-600 mx-auto md:mx-0 shadow-sm border border-neutral-100">
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
