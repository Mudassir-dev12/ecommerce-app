'use client';

import * as React from 'react';
import Image from 'next/image';

const BANNERS = [
  {
    id: 1,
    desktopImage: '/b1.webp',
    mobileImage: '/b1.1.webp',
    alt: 'Modern Traders Fashion Banner 1',
  },
  {
    id: 2,
    desktopImage: '/b2.webp',
    mobileImage: '/b2.1.webp',
    alt: 'Modern Traders Fashion Banner 2',
  },
  {
    id: 3,
    desktopImage: '/b3.webp',
    mobileImage: '/b3.1.webp',
    alt: 'Modern Traders Fashion Banner 3',
  },
];

export function HeroScrollBanners() {
  return (
    <div className="relative w-full select-none -mt-24">
      {BANNERS.map((banner, index) => {
        const zIndex = (index + 1) * 10;

        return (
          <div
            key={banner.id}
            style={{
              position: 'sticky',
              top: '0px',
              zIndex: zIndex,
            }}
            className="relative w-full h-screen min-h-[550px] overflow-hidden bg-neutral-950 rounded-none border-none shadow-none transition-all duration-500 ease-out"
          >
            {/* Full-Bleed Hero Banner */}
            <div className="relative w-full h-full rounded-none overflow-hidden">
              {/* Desktop Banner Image (b1.webp, b2.webp, b3.webp for md+ screens) */}
              <Image
                src={banner.desktopImage}
                alt={banner.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hidden md:block object-cover object-center rounded-none"
              />

              {/* Mobile Banner Image (b1.1.webp, b2.1.webp, b3.1.webp for mobile screens) */}
              <Image
                src={banner.mobileImage}
                alt={`${banner.alt} Mobile`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="block md:hidden object-cover object-center rounded-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
