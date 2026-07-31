'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface BannerItem {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  highlight: string;
  buttonText: string;
  link: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 1,
    image: '/1.jpg',
    subtitle: 'Grace, Handcrafted.',
    title: 'Womens Arrival',
    highlight: 'Collection ’26',
    buttonText: 'Shop New Arrivals',
    link: '/products',
  },
  {
    id: 2,
    image: '/2.jpg',
    subtitle: 'Timeless Luxury & Style',
    title: 'Unstitched Festive',
    highlight: 'Luxury Edition',
    buttonText: 'Explore Collection',
    link: '/products',
  },
  {
    id: 3,
    image: '/3.jpg',
    subtitle: 'Pure Silk & Premium Lawn',
    title: 'Embroidered Pret',
    highlight: 'Couture Series',
    buttonText: 'View Catalog',
    link: '/products',
  },
];

export function HeroScrollBanners() {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* Header Label */}
      <div className="text-center space-y-2 mb-4">
        <span className="inline-block text-xs font-extrabold uppercase tracking-[0.25em] text-[#B57A20] bg-[#FAEAD9] border border-[#e7dccb] px-4 py-1.5 rounded-full shadow-2xs">
          ✨ Modern Traders • Womens Arrival
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#131213] tracking-tight">
          Featured Luxury Collections
        </h2>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Scroll down to reveal our exclusive high-fashion seasonal banners.
        </p>
      </div>

      {/* Sticky Overlapping Stacking Cards Container */}
      <div className="relative w-full space-y-12">
        {BANNERS.map((banner, index) => {
          // Calculate top offset and z-index for overlapping stack effect
          const topOffset = 100 + index * 28; // 100px, 128px, 156px
          const zIndex = (index + 1) * 10;   // 10, 20, 30

          return (
            <div
              key={banner.id}
              style={{
                position: 'sticky',
                top: `${topOffset}px`,
                zIndex: zIndex,
              }}
              className="w-full h-[calc(100vh-160px)] min-h-[520px] max-h-[780px] rounded-3xl overflow-hidden shadow-2xl border border-[#e7dccb] bg-[#131213] transition-all duration-500 transform group"
            >
              {/* Full Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Luxury Dark Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131213]/90 via-[#131213]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#131213]/60 via-transparent to-transparent" />

                {/* Number Badge (01, 02, 03) */}
                <div className="absolute top-6 right-8 z-20 flex items-center gap-2 bg-[#131213]/70 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                  <span className="text-xs font-bold text-[#F1A19B] tracking-wider uppercase">Collection</span>
                  <span className="text-base font-black text-[#B57A20] font-mono">
                    0{banner.id}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-10 left-8 right-8 sm:left-12 sm:right-12 z-20 space-y-3 max-w-2xl text-white">
                  <span className="inline-block text-sm sm:text-base font-serif italic text-[#F1A19B] tracking-widest">
                    {banner.subtitle}
                  </span>

                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase font-serif leading-tight text-white drop-shadow-md">
                    {banner.title} <br />
                    <span className="text-[#B57A20] font-sans font-extrabold normal-case tracking-normal block mt-1">
                      {banner.highlight}
                    </span>
                  </h2>

                  <div className="pt-2">
                    <Link href={banner.link}>
                      <span className="inline-flex items-center gap-2 rounded-xl bg-[#B57A20] hover:bg-[#9f641a] text-white px-7 py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-amber-950/40 transition-all transform hover:scale-105 cursor-pointer">
                        <span>{banner.buttonText}</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Scroll Indicator */}
                {index === 0 && (
                  <div className="absolute bottom-4 right-8 z-20 hidden sm:flex items-center gap-1.5 text-xs text-[#FAEAD9]/80 animate-bounce">
                    <span className="font-bold tracking-wider">Scroll down to stack banners</span>
                    <ChevronDown className="h-4 w-4 text-[#B57A20]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
