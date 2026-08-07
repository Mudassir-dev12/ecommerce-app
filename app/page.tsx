import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Percent, ShieldCheck, Zap } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/api';
import { HeroScrollBanners } from '@/components/home/HeroScrollBanners';
import { ProductCarouselSection } from '@/components/product/ProductCarouselSection';
import { HomeVideoSection } from '@/components/home/HomeVideoSection';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [productsRes, categories] = await Promise.all([
    getProducts({}, 'featured', 1, 30),
    getCategories(),
  ]);

  const products = productsRes.products || [];

  // Group dynamic products for distinct category sliders (strict non-overlapping slices)
  const section1Products = products.slice(0, 5);
  const section2Products = products.slice(5, 10);
  const section3Products = products.slice(10, 15);

  return (
    <div className="space-y-16 pb-16">
      
      {/* ─── Full-Screen Vertical Scroll Banners ───────────────────────────── */}
      <HeroScrollBanners />


      {/* ─── Product Carousel #1 (After Categories) ───────────────────────── */}
      {section1Products.length > 0 && (
        <ProductCarouselSection
          title="Premium Women's 3-Piece Suit Embroidery"
          categorySlug={section1Products[0]?.categorySlug || 'all'}
          products={section1Products}
          autoPlayInterval={3500}
        />
      )}

      {/* ─── Banner 1 (7.webp) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/7.webp"
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
      {section2Products.length > 0 && (
        <ProductCarouselSection
          title="Maxi 3-Piece Suit"
          categorySlug={section2Products[0]?.categorySlug || 'all'}
          products={section2Products}
          autoPlayInterval={4000}
        />
      )}

      {/* ─── Banner 2 (8.webp) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/8.webp"
              alt="Luxury Collection - 8"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Product Carousel #3 (After Banner 2) ───────────────────────── */}
      {section3Products.length > 0 && (
        <ProductCarouselSection
          title="Luxury Dress Collection"
          categorySlug={section3Products[0]?.categorySlug || 'all'}
          products={section3Products}
          autoPlayInterval={4500}
        />
      )}

      {/* ─── Banner 3 (9.webp) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <Link href="/products" className="relative block w-full bg-white border border-neutral-200 overflow-hidden rounded-[4px] shadow-sm hover:shadow-md transition-shadow">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/9.webp"
              alt="Luxury Arrival - 9"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center hover:scale-102 transition-transform duration-700 rounded-[4px]"
            />
          </div>
        </Link>
      </section>

      {/* ─── Video Campaigns Infinite Carousel (Hover Blur Focus) ─────────── */}
      <HomeVideoSection />


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
