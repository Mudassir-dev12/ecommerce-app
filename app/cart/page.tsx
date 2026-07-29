'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ArrowLeft, Ticket, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { validatePromoCode } from '@/lib/api';

export default function CartPage() {
  const { toast } = useToast();
  const cart = useStore((state) => state.cart);
  const promoCode = useStore((state) => state.promoCode);
  const applyPromoCode = useStore((state) => state.applyPromoCode);
  const clearCart = useStore((state) => state.clearCart);

  const [promoInput, setPromoInput] = React.useState('');
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  // Sync input value with current promoCode
  React.useEffect(() => {
    if (promoCode) {
      setPromoInput(promoCode.code);
    }
  }, [promoCode]);

  // Calculations
  const subtotal = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = React.useMemo(() => {
    if (!promoCode) return 0;
    if (promoCode.minOrder && subtotal < promoCode.minOrder) {
      return 0; // Did not reach threshold
    }
    if (promoCode.type === 'percentage') {
      return subtotal * (promoCode.value / 100);
    } else {
      return promoCode.value; // fixed dollar amount
    }
  }, [promoCode, subtotal]);

  // Clean out promo code if cart subtotal goes below minimum order threshold
  React.useEffect(() => {
    if (promoCode?.minOrder && subtotal < promoCode.minOrder) {
      applyPromoCode(null);
      toast(`Promo code ${promoCode.code} removed because order subtotal is below ${formatPrice(promoCode.minOrder)}.`, 'warning');
    }
  }, [subtotal, promoCode, applyPromoCode, toast]);

  const shipping = subtotal > 150 ? 0 : subtotal > 0 ? 15 : 0; // free shipping over $150
  const tax = subtotal * 0.09; // flat 9% simulated tax rate
  const total = Math.max(subtotal - discountAmount + shipping + tax, 0);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsValidatingPromo(true);
    try {
      const codeData = await validatePromoCode(promoInput.trim());
      if (codeData && codeData.isValid) {
        if (codeData.minOrder && subtotal < codeData.minOrder) {
          toast(
            `Promo code ${codeData.code} requires a minimum subtotal of ${formatPrice(codeData.minOrder)}.`,
            'error'
          );
        } else {
          applyPromoCode(codeData);
          toast(`Promo code "${codeData.code}" applied successfully!`, 'success');
        }
      } else {
        toast('Invalid promo code. Please check and try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error validating promo code.', 'error');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    applyPromoCode(null);
    setPromoInput('');
    toast('Promo code removed.', 'info');
  };

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

              {promoCode && (
                <div className="flex justify-between text-sm text-emerald-600 font-semibold items-center">
                  <div className="flex items-center gap-1">
                    <span>Discount ({promoCode.code})</span>
                    <button
                      onClick={handleRemovePromo}
                      className="text-neutral-400 hover:text-rose-500 text-[10px] font-bold underline"
                    >
                      Remove
                    </button>
                  </div>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-neutral-800">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
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

          {/* Promo code panel */}
          <div className="rounded-2xl border border-neutral-155 bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary-500" />
              <span>Promo Code</span>
            </h4>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SAVE10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={!!promoCode}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm uppercase placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!promoCode ? (
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isValidatingPromo}
                  className="px-4 text-xs shrink-0"
                >
                  Apply
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleRemovePromo}
                  variant="outline"
                  size="sm"
                  className="px-4 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 shrink-0 border-rose-100"
                >
                  Remove
                </Button>
              )}
            </form>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Try code <span className="font-semibold text-neutral-500">SAVE10</span> for 10% off, or{' '}
              <span className="font-semibold text-neutral-500">WELCOME20</span> for 20% off orders over $100.
            </p>
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
