'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

import { Skeleton } from '@/components/ui/Skeleton';

export default function CartPage() {
  const { toast } = useToast();
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);

  const [showSkeleton, setShowSkeleton] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculations
  const subtotal = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const shipping = subtotal > 0 ? 300 : 0; // Fixed COD Delivery Charge ($300)
  const tax = subtotal * 0.09; // flat 9% simulated tax rate
  const total = Math.max(subtotal + shipping + tax, 0);

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-neutral-150 bg-white p-6">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1 rounded-2xl border border-neutral-150 bg-white p-6 space-y-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 animate-pulse-slow">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
            Looks like you haven't added any products to your shopping cart yet. Explore our latest items!
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" className="gap-2 px-6 shadow-glow">
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Start Shopping</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* ─── Header title ─── */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-neutral-500">
          You have <span className="font-semibold text-neutral-800">{cart.length}</span> unique items in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm">
          <div className="divide-y divide-neutral-100">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-6 flex justify-between items-center">
            <Link href="/products" className="group flex items-center gap-1.5 text-sm font-bold text-neutral-500 hover:text-primary-600 transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={() => {
                clearCart();
                toast('Your cart has been cleared.', 'info');
              }}
              className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Summary Details */}
          <div className="rounded-2xl border border-neutral-155 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-3.5 border-b border-neutral-100 pb-5">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-neutral-600">
                <span>COD Delivery Charge</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-neutral-600">
                <span>Estimated Tax (9%)</span>
                <span className="font-semibold text-neutral-800">{formatPrice(tax)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-neutral-950">Grand Total</span>
              <span className="text-2xl font-extrabold text-neutral-900">{formatPrice(total)}</span>
            </div>

            {/* Checkout Actions */}
            <Link href="/checkout" className="block">
              <Button variant="primary" className="w-full sm:h-12 text-sm font-bold gap-2 shadow-glow">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Secure details info */}
          <div className="flex gap-2.5 items-start justify-center p-3 text-xs text-neutral-400">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-normal">
              Your details are protected using SSL encryption. All transactions are securely completed.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

