import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Percent, ShieldCheck, Zap } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  const heroProduct = featuredProducts.length > 0 ? featuredProducts[0] : null;

  return (
    <div className="space-y-16 pb-16">
      
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-neutral-900 text-white rounded-b-[2rem] shadow-glow-lg">
        {/* Decorative grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-96 w-96 rounded-full bg-primary-600/35 filter blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Call to action */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-bold tracking-wide text-primary-400 uppercase ring-1 ring-primary-500/20">
                {heroProduct?.brand ? `${heroProduct.brand} • Featured Pick` : 'New Arrivals'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {heroProduct ? heroProduct.name : 'Discover Premium Quality Products'}
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 max-w-lg mx-auto lg:mx-0 leading-relaxed line-clamp-3">
                {heroProduct
                  ? heroProduct.description
                  : 'Explore our wide selection of top-rated items curated just for you with unbelievable prices and fast delivery.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {heroProduct ? (
                  <Link href={`/products/${heroProduct.slug}`}>
                    <span className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 text-base font-bold text-white shadow-glow hover:bg-primary-700 transition-all cursor-pointer">
                      Buy Now
                    </span>
                  </Link>
                ) : null}
                <Link href="/products">
                  <span className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-6 py-3.5 text-base font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer gap-2">
                    <span>Explore Shop</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Visual Hero Image Callout */}
            {heroProduct && (
              <div className="relative aspect-[4/3] w-full max-w-lg mx-auto overflow-hidden rounded-3xl bg-neutral-800 border border-neutral-700 p-2 shadow-2xl flex items-center justify-center">
                <Image
                  src={heroProduct.images[0]?.url || 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'}
                  alt={heroProduct.name}
                  fill
                  priority
                  className="object-cover object-center scale-[1.02] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-2xl p-4 flex justify-between items-center gap-4 shadow-xl">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{heroProduct.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">{heroProduct.brand} • {heroProduct.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-primary-400">{formatPrice(heroProduct.price)}</span>
                    {heroProduct.originalPrice && heroProduct.originalPrice > heroProduct.price && (
                      <p className="text-[10px] text-neutral-500 line-through">{formatPrice(heroProduct.originalPrice)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ─── Category Grid ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Shop by Category</h2>
          <p className="text-sm text-neutral-500 max-w-md">Browse our wide catalog of high-quality products curated for you.</p>
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

