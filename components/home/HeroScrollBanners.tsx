'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const totalHeight = () => (BANNERS.length - 1) * window.innerHeight;

    const ctx = gsap.context(() => {
      // Main Vertical Pin Animation with Scrub (Top to Bottom Slide Motion)
      const scrollTween = gsap.to(track, {
        yPercent: -100 * ((BANNERS.length - 1) / BANNERS.length),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.2, // Cinematic 1.2s smooth scrub lag
          start: 'top top+=80', // Align right under 80px sticky header
          end: () => `+=${totalHeight()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Subtle Image Scale (105% -> 100%) and Parallax per panel
      const panels = gsap.utils.toArray<HTMLElement>('.hero-slide-vert');
      panels.forEach((panel) => {
        const image = panel.querySelector('.hero-bg-img-vert');
        const textContent = panel.querySelector('.hero-text-content-vert');

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.05 },
            {
              scale: 1.0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (textContent) {
          gsap.fromTo(
            textContent,
            { y: 45, opacity: 0.2 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'top 80%',
                end: 'center center',
                scrub: true,
              },
            }
          );
        }
      });
    }, containerRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-neutral-950 select-none"
    >
      {/* Vertical Track (300vh for 3 vertical panels) */}
      <div
        ref={trackRef}
        className="flex flex-col w-full h-[300%] will-change-transform"
        style={{ force3D: true } as React.CSSProperties}
      >
        {BANNERS.map((banner, index) => (
          <section
            key={banner.id}
            className="hero-slide-vert relative w-full h-1/3 flex-shrink-0 overflow-hidden bg-neutral-950 rounded-none border-none"
          >
            <div className="relative w-full h-full rounded-none overflow-hidden">
              {/* Background Image with Scale Animation */}
              <div className="hero-bg-img-vert absolute inset-0 w-full h-full will-change-transform">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center rounded-none"
                />
              </div>

              {/* Dark Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131213]/90 via-[#131213]/35 to-[#131213]/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#131213]/70 via-transparent to-[#131213]/40" />

              {/* Collection Number Badge */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-2 bg-[#131213]/70 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#F1A19B]" />
                <span className="text-xs font-bold text-[#F1A19B] tracking-wider uppercase">Collection</span>
                <span className="text-base font-black text-[#B57A20] font-mono">
                  0{banner.id} / 0{BANNERS.length}
                </span>
              </div>

              {/* Full Screen Luxury Typography Overlay */}
              <div className="hero-text-content-vert absolute inset-0 flex items-center z-10 will-change-transform">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 w-full">
                  <div className="max-w-2xl space-y-4 text-white">
                    <span className="inline-block text-base sm:text-xl font-serif italic text-[#F1A19B] tracking-widest drop-shadow-md">
                      {banner.subtitle}
                    </span>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase font-serif leading-[1.1] text-white drop-shadow-xl">
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

              {/* Vertical Scroll Direction Prompt */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/80 animate-bounce">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FAEAD9]/90">
                  {index < BANNERS.length - 1 ? 'Scroll down for next collection ↓' : 'Scroll down to shop ↓'}
                </span>
                <ChevronDown className="h-4 w-4 text-[#B57A20]" />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
