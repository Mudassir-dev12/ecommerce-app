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
    <div className="relative w-full overflow-hidden">
      {BANNERS.map((banner, index) => {
        const zIndex = (index + 1) * 10;

        return (
          <section
            key={banner.id}
            style={{
              position: 'sticky',
              top: '0px',
              zIndex: zIndex,
            }}
            className="relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-950 rounded-none border-none select-none transition-all duration-700 ease-out"
          >
            {/* Edge-to-Edge Full Screen Image (No Border Radius, No Card Margins) */}
            <div className="relative w-full h-full rounded-none overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center rounded-none scale-100 transition-transform duration-1000 ease-out"
              />

              {/* Smooth Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131213]/85 via-[#131213]/35 to-[#131213]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#131213]/60 via-transparent to-[#131213]/30" />

              {/* Number Badge (01, 02, 03) */}
              <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-[#131213]/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                <span className="text-xs font-bold text-[#F1A19B] tracking-wider uppercase">Collection</span>
                <span className="text-base font-black text-[#B57A20] font-mono">
                  0{banner.id}
                </span>
              </div>

              {/* Full Screen Luxury Typography Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 w-full">
                  <div className="max-w-2xl space-y-4 text-white animate-fade-in">
                    <span className="inline-block text-base sm:text-lg font-serif italic text-[#F1A19B] tracking-widest drop-shadow-md">
                      {banner.subtitle}
                    </span>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase font-serif leading-[1.1] drop-shadow-lg">
                      {banner.title} <br />
                      <span className="text-[#B57A20] font-sans font-extrabold normal-case tracking-normal block mt-2">
                        {banner.highlight}
                      </span>
                    </h1>

                    <div className="pt-4">
                      <Link href={banner.link}>
                        <span className="inline-flex items-center gap-2.5 rounded-xl bg-[#B57A20] hover:bg-[#9f641a] text-white px-8 py-4 text-base font-bold shadow-2xl shadow-amber-950/50 transition-all transform hover:scale-105 cursor-pointer">
                          <span>{banner.buttonText}</span>
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Down Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/80 animate-bounce">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FAEAD9]/90">
                  {index < BANNERS.length - 1 ? 'Scroll down for next collection' : 'Scroll down to shop'}
                </span>
                <ChevronDown className="h-5 w-5 text-[#B57A20]" />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
