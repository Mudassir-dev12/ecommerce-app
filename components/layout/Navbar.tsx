'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Heart, User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = React.useState(false);

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isHomePage = pathname === '/';

  // Trigger scroll detection for hero section on home page
  React.useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 2.2;
      if (window.scrollY > heroThreshold) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if text/icons should be white (on homepage hero overlay) or dark (scrolled / inner pages)
  const isOverlayMode = isHomePage && !isScrolledPastHero;

  const textColorClass = isOverlayMode
    ? 'text-white hover:text-amber-300 drop-shadow-sm'
    : 'text-[#131213] hover:text-[#B57A20]';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        isOverlayMode
          ? 'bg-transparent border-none shadow-none backdrop-blur-none'
          : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-sm'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* LEFT: LOGO (Uses logo3.png when over hero carousel, logo1.png when scrolled / inner pages) */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={isOverlayMode ? '/logo3.png' : '/logo1.png'}
              alt="Modern Traders Logo"
              width={64}
              height={64}
              priority
              className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>

          {/* RIGHT: NAVIGATION LINKS */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm uppercase tracking-wider">
              <Link href="/" className={cn('transition-colors', textColorClass)}>
                Home
              </Link>
              <Link href="/products" className={cn('transition-colors', textColorClass)}>
                Shop
              </Link>
              <Link href="/reviews" className={cn('transition-colors', textColorClass)}>
                Reviews
              </Link>
            </nav>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="/wishlist"
                className={cn('relative p-2 transition-colors', textColorClass)}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B57A20] text-[10px] font-bold text-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className={cn('relative p-2 transition-colors', textColorClass)}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B57A20] text-[10px] font-bold text-white shadow-sm">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className={cn('relative p-2 transition-colors', textColorClass)}
                aria-label="My Account & Orders"
                title="My Account & Orders"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn('p-2 md:hidden transition-colors', textColorClass)}
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
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl p-6 z-40 flex flex-col gap-4 font-bold text-base uppercase">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-neutral-100"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-neutral-100"
          >
            Shop
          </Link>
          <Link
            href="/reviews"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20] border-b border-neutral-100"
          >
            Reviews
          </Link>
          <Link
            href="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-2 text-[#131213] hover:text-[#B57A20]"
          >
            Account / My Orders
          </Link>
        </div>
      )}
    </header>
  );
}
