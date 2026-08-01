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

  // Group dynamic products for 3 distinct category sliders
  const section1Products = products.length > 0 ? products : [];
  const section2Products = products.length >= 4 ? [...products.slice(4), ...products.slice(0, 4)] : products;
  const section3Products = products.length >= 8 ? [...products.slice(8), ...products.slice(0, 8)] : products;

  // Category labels dynamically derived from fetched categories
  const cat1 = categories[0] || { name: 'Pret Collection', slug: 'pret' };
  const cat2 = categories[1] || { name: 'Unstitched', slug: 'unstitched' };
  const cat3 = categories[2] || { name: 'Luxury Fragrances', slug: 'him' };

  return (
    <div className="space-y-16 pb-16">
      
      {/* ─── Full-Screen Vertical Scroll Banners ─ */}
      <HeroScrollBanners />

      {/* ─── Circular Story Avatar Categories (Dynamic) ──────────────────────── */}
      <section id="shop-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pt-8 scroll-mt-24">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-2 no-scrollbar flex-nowrap">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center shrink-0 cursor-pointer"
            >
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-[#e7dccb] p-1 bg-white shadow-md group-hover:scale-105 group-hover:border-[#B57A20] transition-all duration-300">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 80px, 112px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-extrabold tracking-widest text-[#131213] uppercase group-hover:text-[#B57A20] transition-colors text-center whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Product Carousel #1 (After Categories) ───────────────────────── */}
      <ProductCarouselSection
        title={`${cat1.name} Collection`}
        subtitle="Explore our finest handpicked fashion items"
        categorySlug={cat1.slug}
        products={section1Products}
        autoPlayInterval={3500}
      />

      {/* ─── Banner 1 (b4.jpg) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="relative block w-full bg-[#f4f2ed]">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/b4.jpg"
              alt="Luxury Edition - b4"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="object-cover object-center"
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

      {/* ─── Banner 2 (b5.jpg) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="relative block w-full bg-[#f4f2ed]">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/b5.jpg"
              alt="Luxury Collection - b5"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
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

      {/* ─── Banner 3 (b6.jpg) ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="relative block w-full bg-[#f4f2ed]">
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
            <Image
              src="/b6.jpg"
              alt="Luxury Arrival - b6"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </div>
        </Link>
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

