'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { Skeleton } from '../ui/Skeleton';

interface HomeCategoriesSectionProps {
  categories: Category[];
}

export function HomeCategoriesSection({ categories }: HomeCategoriesSectionProps) {
  const [showSkeleton, setShowSkeleton] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <section id="shop-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pt-8 scroll-mt-24 select-none">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-2 no-scrollbar flex-nowrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`cat-skel-${i}`} className="flex flex-col items-center shrink-0 space-y-3">
              <Skeleton className="h-20 w-20 sm:h-28 sm:w-28 rounded-full" />
              <Skeleton className="h-3.5 w-16 sm:w-20 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="shop-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 pt-8 scroll-mt-24 animate-fade-in-up">
      <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-2 no-scrollbar flex-nowrap">
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center shrink-0 cursor-pointer hover-lift"
          >
            <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-[#e7dccb] p-1 bg-white shadow-md group-hover:scale-105 group-hover:border-[#131213] transition-all duration-300">
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
            <span className="mt-3 text-xs sm:text-sm font-extrabold tracking-widest text-[#131213] uppercase group-hover:text-[#131213] transition-colors text-center whitespace-nowrap">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
