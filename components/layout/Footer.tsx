'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, HelpCircle, Shield, Truck, RotateCcw } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';

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
            <div className="flex gap-4">
              <a href="#" className="hover:text-neutral-200 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-neutral-200 transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="hover:text-neutral-200 transition-colors" aria-label="Github">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
              <a href="#" className="hover:text-neutral-200 transition-colors" aria-label="Linkedin">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
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

          {/* Company links */}
          <div>
            <h5 className="font-semibold text-neutral-200 text-sm mb-4">Company</h5>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-neutral-200 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-neutral-200 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-neutral-200 transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-neutral-200 transition-colors">Contact Us</a></li>
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
