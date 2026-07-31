'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

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
    <div className="relative w-full flex flex-col">
      {BANNERS.map((banner, index) => (
        <section
          key={banner.id}
          className="relative w-full h-[calc(100vh-80px)] min-h-[600px] overflow-hidden flex items-center justify-center select-none border-b border-[#e7dccb]/40"
        >
          {/* Full-bleed background image */}
          <div className="relative w-full h-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={index === 0}
              className="object-cover object-center"
            />

            {/* Gradient Overlays for High Luxury Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/35 to-neutral-950/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />
          </div>

          {/* Center Luxury Typography Overlay */}
          <div className="absolute z-10 max-w-4xl text-center px-6 text-white space-y-4 animate-fade-in">
            <span className="inline-block text-base sm:text-xl font-serif italic text-[#F1A19B] tracking-widest drop-shadow-md">
              {banner.subtitle}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase font-serif leading-tight drop-shadow-lg">
              {banner.title} <br />
              <span className="text-[#B57A20] font-sans font-extrabold normal-case tracking-normal block mt-2">
                {banner.highlight}
              </span>
            </h1>

            <div className="pt-4">
              <Link href={banner.link}>
                <span className="inline-flex items-center gap-2 rounded-xl bg-[#B57A20] hover:bg-[#9f641a] text-white px-8 py-4 text-base font-bold shadow-xl shadow-amber-950/40 transition-all transform hover:scale-105 cursor-pointer">
                  <span>{banner.buttonText}</span>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll Down Chevron Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/80 animate-bounce">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FAEAD9]">Scroll Down</span>
            <ChevronDown className="h-5 w-5 text-[#B57A20]" />
          </div>
        </section>
      ))}
    </div>
  );
}
