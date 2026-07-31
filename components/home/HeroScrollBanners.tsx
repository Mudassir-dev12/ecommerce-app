'use client';

import * as React from 'react';
import Image from 'next/image';

const BANNERS = [
  { id: 1, image: '/1.jpg', alt: 'Modern Traders Fashion Picture 1' },
  { id: 2, image: '/2.jpg', alt: 'Modern Traders Fashion Picture 2' },
  { id: 3, image: '/3.jpg', alt: 'Modern Traders Fashion Picture 3' },
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
            className="relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-950 rounded-none border-none shadow-none transition-all duration-500 ease-out"
          >
            {/* Pure Full-Bleed Picture behind Transparent Navbar */}
            <div className="relative w-full h-full rounded-none overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center rounded-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
