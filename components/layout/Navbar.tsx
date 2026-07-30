'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchVisibleOnMobile, setIsSearchVisibleOnMobile] = React.useState(false);

  // Sync search input with URL search param
  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsSearchVisibleOnMobile(false);
    }
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-extrabold shadow-glow">
              A
            </span>
            <span>Antigravity</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">
              Shop All
            </Link>
            <Link href="/products?category=electronics" className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=clothing" className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors">
              Clothing
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-md flex-1">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 pl-10 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Icons and Utility */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search toggle for Mobile */}
            <button
              onClick={() => setIsSearchVisibleOnMobile(!isSearchVisibleOnMobile)}
              className="p-2 text-neutral-600 hover:text-primary-600 md:hidden rounded-lg hover:bg-neutral-50"
              aria-label="Search toggle"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-neutral-600 hover:text-primary-600 rounded-lg hover:bg-neutral-50"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-neutral-600 hover:text-primary-600 rounded-lg hover:bg-neutral-50"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Admin Dashboard */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              title="Admin Dashboard"
            >
              Admin Panel
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 text-neutral-600 hover:text-primary-600 rounded-lg hover:bg-neutral-50 hidden sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-600 hover:text-primary-600 md:hidden rounded-lg hover:bg-neutral-50"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isSearchVisibleOnMobile && (
          <div className="py-3 border-t border-neutral-100 md:hidden animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 pl-10 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-neutral-200 shadow-lg p-5 z-30 animate-slide-up flex flex-col gap-4">
          <nav className="flex flex-col gap-3 font-medium">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-neutral-700 hover:text-primary-600 border-b border-neutral-50"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-neutral-700 hover:text-primary-600 border-b border-neutral-50"
            >
              Shop All
            </Link>
            <Link
              href="/products?category=electronics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-neutral-700 hover:text-primary-600 border-b border-neutral-50"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=clothing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-neutral-700 hover:text-primary-600 border-b border-neutral-50"
            >
              Clothing
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-neutral-700 hover:text-primary-600 flex items-center justify-between"
            >
              <span>My Account</span>
              <User className="h-4 w-4 text-neutral-400" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
