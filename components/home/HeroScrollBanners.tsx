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
    <div className="relative w-full overflow-hidden select-none">
      {BANNERS.map((banner, index) => {
        const zIndex = (index + 1) * 10;

        return (
          <section
            key={banner.id}
            style={{
              position: 'sticky',
              top: '80px',
              zIndex: zIndex,
            }}
            className="relative w-full h-[calc(100vh-80px)] min-h-[500px] overflow-hidden bg-neutral-950 rounded-none border-none transition-all duration-700 ease-out"
          >
            {/* Edge-to-Edge Full Screen Responsive Image */}
            <div className="relative w-full h-full rounded-none overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center rounded-none transition-transform duration-1000 ease-out"
              />

              {/* Luxury Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131213]/85 via-[#131213]/35 to-[#131213]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#131213]/60 via-transparent to-[#131213]/30" />

              {/* Responsive Collection Number Badge */}
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 flex items-center gap-2 bg-[#131213]/60 backdrop-blur-md border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                <span className="text-[10px] sm:text-xs font-bold text-[#F1A19B] tracking-wider uppercase">Collection</span>
                <span className="text-sm sm:text-base font-black text-[#B57A20] font-mono">
                  0{banner.id}
                </span>
              </div>

              {/* Full Screen Luxury Typography Overlay (Responsive for Mobile, Tablet, Desktop) */}
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-16 w-full">
                  <div className="max-w-2xl space-y-3 sm:space-y-4 text-white animate-fade-in">
                    <span className="inline-block text-sm sm:text-lg font-serif italic text-[#F1A19B] tracking-widest drop-shadow-md">
                      {banner.subtitle}
                    </span>

                    <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase font-serif leading-[1.1] drop-shadow-lg text-white">
                      {banner.title} <br />
                      <span className="text-[#B57A20] font-sans font-extrabold normal-case tracking-normal block mt-1 sm:mt-2">
                        {banner.highlight}
                      </span>
                    </h1>

                    <div className="pt-2 sm:pt-4">
                      <Link href={banner.link}>
                        <span className="inline-flex items-center gap-2 rounded-xl bg-[#B57A20] hover:bg-[#9f641a] text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold shadow-2xl shadow-amber-950/50 transition-all transform hover:scale-105 cursor-pointer">
                          <span>{banner.buttonText}</span>
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Down Indicator Chevron */}
              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/80 animate-bounce">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#FAEAD9]/90">
                  {index < BANNERS.length - 1 ? 'Scroll down for next collection' : 'Scroll down to shop'}
                </span>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#B57A20]" />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
