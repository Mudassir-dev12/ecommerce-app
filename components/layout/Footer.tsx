'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, HelpCircle, Shield, Truck, RotateCcw } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast(`Successfully subscribed! Welcome aboard, ${email}!`, 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
      
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-neutral-800 bg-neutral-950/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-primary-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Express COD Delivery</h4>
                <p className="text-xs text-neutral-500">Fast delivery to your doorstep</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-primary-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Easy Exchanges</h4>
                <p className="text-xs text-neutral-500">Hassle-free size exchange policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-primary-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">100% Authentic Quality</h4>
                <p className="text-xs text-neutral-500">Premium luxury fabrics & designs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-primary-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">Dedicated Customer Support</h4>
                <p className="text-xs text-neutral-500">Call or WhatsApp anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand/About */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/logo2.png"
                alt="Modern Traders Logo"
                width={52}
                height={52}
                className="h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white uppercase">
                  Modern Traders
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#F1A19B] uppercase">
                  Womens Arrival
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              Modern Traders - Womens Arrival is your premier destination for luxury women's fashion, designer apparel, and elegant collections.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61593194094076"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-400 hover:text-[#1877F2] transition-colors group/fb"
                aria-label="Facebook"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 group-hover/fb:bg-[#1877F2] text-neutral-300 group-hover/fb:text-white transition-all shadow-sm">
                  <FacebookIcon className="h-5 w-5 fill-current" />
                </div>
                <span className="text-xs font-semibold text-neutral-300 group-hover/fb:text-white transition-colors">
                  Follow on Facebook
                </span>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h5 className="font-semibold text-neutral-200 text-sm mb-4">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-neutral-200 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-neutral-200 transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=clothing" className="hover:text-neutral-200 transition-colors">Clothing</Link></li>
              <li><Link href="/products?category=footwear" className="hover:text-neutral-200 transition-colors">Footwear</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h5 className="font-semibold text-neutral-200 text-sm mb-4">Resources</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/reviews" className="hover:text-[#F1A19B] transition-colors">Customer Reviews &amp; Ratings</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#F1A19B] transition-colors">My Wishlist</Link></li>
              <li><Link href="/account" className="hover:text-[#F1A19B] transition-colors">Account Dashboard</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="min-w-[200px]">
            <h5 className="font-semibold text-neutral-200 text-sm mb-4">Newsletter</h5>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3.5 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Button type="submit" variant="primary" size="icon" className="shrink-0 h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Modern Traders - Womens Arrival. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neutral-200 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
