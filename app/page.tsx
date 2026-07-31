import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Percent, ShieldCheck, Zap } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroScrollBanners } from '@/components/home/HeroScrollBanners';
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
      
      {/* ─── Full-Screen Vertical Scroll Banners (1.jpg -> 2.jpg -> 3.jpg) ─ */}
      <HeroScrollBanners />

      {/* ─── Circular Story Avatar Categories (Dynamic) ──────────────────────── */}
      <section id="shop-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pt-8 scroll-mt-24">
        <div className="flex items-center justify-center gap-6 sm:gap-12 overflow-x-auto pb-4 pt-2 no-scrollbar flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center shrink-0 cursor-pointer"
            >
              {/* Circle Avatar Image Container matching user reference photo */}
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-2 border-[#e7dccb] p-1 bg-white shadow-md group-hover:scale-105 group-hover:border-[#B57A20] transition-all duration-300">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              {/* Bold Uppercase Title Label matching reference photo */}
              <span className="mt-3 text-xs sm:text-sm font-extrabold tracking-widest text-[#131213] uppercase group-hover:text-[#B57A20] transition-colors">
                {cat.name}
              </span>
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

