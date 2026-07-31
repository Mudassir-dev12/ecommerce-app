'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';

interface BannerSlide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  highlight: string;
  buttonText: string;
  link: string;
}

const BANNERS: BannerSlide[] = [
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

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-advance slides every 5 seconds
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const scrollToShop = () => {
    const section = document.getElementById('shop-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[550px] max-h-[920px] overflow-hidden bg-neutral-950 select-none">
      {/* Background Slides */}
      {BANNERS.map((banner, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Full-bleed background image with subtle scale effect */}
            <div className="relative w-full h-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-neutral-950/20" />
            </div>

            {/* Banner Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 w-full">
                <div className="max-w-xl space-y-5 text-white animate-fade-in">
                  <span className="inline-block text-sm sm:text-base font-serif italic text-[#F1A19B] tracking-wider">
                    {banner.subtitle}
                  </span>

                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] font-serif uppercase drop-shadow-md">
                    {banner.title} <br />
                    <span className="text-[#B57A20] font-sans font-extrabold normal-case tracking-normal block mt-1">
                      {banner.highlight}
                    </span>
                  </h1>

                  <div className="pt-3">
                    <Link href={banner.link}>
                      <span className="inline-flex items-center gap-2 rounded-xl bg-[#B57A20] hover:bg-[#9f641a] text-white px-7 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-amber-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer">
                        <span>{banner.buttonText}</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Arrow Controls (Left & Right) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/40 text-white/80 hover:bg-neutral-900/80 hover:text-white backdrop-blur-md transition-all border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/40 text-white/80 hover:bg-neutral-900/80 hover:text-white backdrop-blur-md transition-all border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Vertical Dots Navigation Indicator (Right side - as in saya.pk) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentSlide(i);
            }}
            className={`transition-all rounded-full ${
              i === currentSlide
                ? 'h-8 w-2.5 bg-[#B57A20] shadow-glow'
                : 'h-2.5 w-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Smooth Scroll Down Indicator Chevron (Bottom Center - as in saya.pk) */}
      <button
        onClick={scrollToShop}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-all cursor-pointer animate-bounce-slow"
        aria-label="Scroll down to products"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#FAEAD9]/90">Scroll Down</span>
        <ChevronDown className="h-5 w-5 text-[#B57A20]" />
      </button>
    </section>
  );
}
