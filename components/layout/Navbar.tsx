'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = React.useState(false);

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Trigger glassmorphism ONLY after completely scrolling past the hero banners
  React.useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled past the full hero section (approx 2.2x screen height)
      const heroThreshold = window.innerHeight * 2.2;
      if (window.scrollY > heroThreshold) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        isScrolledPastHero
          ? 'bg-[#FAEAD9]/85 backdrop-blur-md border-b border-[#e7dccb]/70 shadow-sm'
          : 'bg-transparent border-none shadow-none backdrop-blur-none'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex h-24 items-center justify-between gap-4">
          
          {/* LEFT: BIGGER LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/pnglogo.png"
              alt="Modern Traders Logo"
              width={96}
              height={96}
              priority
              className="h-16 sm:h-20 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>

          {/* RIGHT: NAVIGATION LINKS (Home, Shop, Blog, FAQs) */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm uppercase tracking-wider">
              <Link href="/" className="text-[#131213] hover:text-[#B57A20] transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-[#131213] hover:text-[#B57A20] transition-colors">
                Shop
              </Link>
              <Link href="/blog" className="text-[#131213] hover:text-[#B57A20] transition-colors">
                Blog
              </Link>
              <Link href="/faqs" className="text-[#131213] hover:text-[#B57A20] transition-colors">
                FAQs
              </Link>
            </nav>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="/wishlist"
                className="relative p-2 text-[#131213] hover:text-[#B57A20] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B57A20] text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-[#131213] hover:text-[#B57A20] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B57A20] text-[10px] font-bold text-white">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#131213] hover:text-[#B57A20] md:hidden"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-24 bg-[#FAEAD9]/95 backdrop-blur-md border-b border-[#e7dccb] shadow-xl p-6 z-40 flex flex-col gap-4 font-bold text-base uppercase">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-[#e7dccb]/50"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-[#e7dccb]/50"
          >
            Shop
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-[#e7dccb]/50"
          >
            Blog
          </Link>
          <Link
            href="/faqs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-[#e7dccb]/50"
          >
            FAQs
          </Link>
        </div>
      )}
    </header>
  );
}
