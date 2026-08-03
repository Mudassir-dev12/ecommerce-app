'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShoppingBag, CheckCircle, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderReview } from '@/components/checkout/OrderReview';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { createOrder, getCurrentUser, updateCurrentUser } from '@/lib/api';
import type { ShippingFormData, PaymentFormData, OrderItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Zustand State hooks
  const cart = useStore((state) => state.cart);
  const promoCode = useStore((state) => state.promoCode);
  const clearCart = useStore((state) => state.clearCart);

  // Stepper state
  const [step, setStep] = React.useState<'shipping' | 'payment' | 'review'>('shipping');

  // Form values storage
  const [shippingData, setShippingData] = React.useState<ShippingFormData | null>(null);
  const [paymentData, setPaymentData] = React.useState<PaymentFormData | null>(null);
  
  // Placement status
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderCompleteNumber, setOrderCompleteNumber] = React.useState<string | null>(null);

  // Hydration safety: Redirect if cart is empty and order is not complete
  React.useEffect(() => {
    if (cart.length === 0 && !orderCompleteNumber) {
      router.push('/cart');
    }
  }, [cart, orderCompleteNumber, router]);

  // Total pricing calculations
  const subtotal = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = React.useMemo(() => {
    if (!promoCode) return 0;
    if (promoCode.minOrder && subtotal < promoCode.minOrder) return 0;
    
    if (promoCode.type === 'percentage') {
      return subtotal * (promoCode.value / 100);
    } else {
      return promoCode.value;
    }
  }, [promoCode, subtotal]);

  const shipping = 300; // Fixed COD Delivery Charge ($300)
  const tax = subtotal * 0.09;
  const total = Math.max(subtotal - discountAmount + shipping + tax, 0);

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setStep('payment');
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const currentUser = await getCurrentUser();

    if (shippingData) {
      try {
        await updateCurrentUser({
          firstName: shippingData.firstName || currentUser.firstName,
          lastName: shippingData.lastName || currentUser.lastName,
          phone: shippingData.phone || currentUser.phone,
          addresses: [
            {
              id: `addr-${Date.now()}`,
              label: 'Shipping Address',
              firstName: shippingData.firstName,
              lastName: shippingData.lastName,
              line1: shippingData.line1,
              line2: shippingData.line2,
              city: shippingData.city,
              state: shippingData.state,
              zip: shippingData.zip,
              country: shippingData.country,
              phone: shippingData.phone,
              isDefault: true,
            },
          ],
        });
      } catch (e) {}
    }

    const generatedOrderNum = `EC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    const paymentMethodLabel = 'Cash on Delivery (COD)';

    try {
      await createOrder({
        userId: currentUser.id,
        orderNumber: generatedOrderNum,
        status: 'pending',
        items: orderItems,
        subtotal,
        shipping,
        tax,
        discount: discountAmount,
        total,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          label: 'Shipping Address',
          firstName: shippingData?.firstName || currentUser.firstName || 'Customer',
          lastName: shippingData?.lastName || currentUser.lastName || '',
          line1: shippingData?.line1 || '',
          line2: shippingData?.line2 || '',
          city: shippingData?.city || '',
          state: shippingData?.state || '',
          zip: shippingData?.zip || '',
          country: shippingData?.country || 'Pakistan',
          phone: shippingData?.phone || '',
        },
        paymentMethod: paymentMethodLabel,
      });
    } catch (err) {
      console.error('Error creating order:', err);
    }

    setIsSubmitting(false);
    setOrderCompleteNumber(generatedOrderNum);
    clearCart();
    toast('Order placed successfully! Thank you for shopping with us.', 'success');
  };

  // ─── Order Completed screen ───
  if (orderCompleteNumber) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-6 animate-bounce-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500 border border-emerald-150">
          <CheckCircle className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-sm text-neutral-500 leading-normal max-w-sm mx-auto">
            Your payment went through and your order has been received. A receipt and shipping update has been sent to your email.
          </p>
        </div>

        <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left space-y-3 font-medium">
          <div className="flex justify-between text-sm border-b border-neutral-100 pb-2">
            <span className="text-neutral-400">Order Number</span>
            <span className="font-mono text-neutral-800 font-bold">{orderCompleteNumber}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-neutral-100 pb-2">
            <span className="text-neutral-400">Est. Shipping Date</span>
            <span className="text-neutral-800 font-semibold">1-2 Business Days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Shipping Mode</span>
            <span className="text-neutral-800 font-semibold flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary-500" />
              <span>Standard Ground</span>
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full justify-center">
          <Link href="/account" className="flex-1 max-w-[200px]">
            <Button variant="secondary" className="w-full text-sm font-semibold">
              View Order History
            </Button>
          </Link>
          <Link href="/products" className="flex-1 max-w-[200px]">
            <Button variant="primary" className="w-full text-sm font-semibold shadow-glow">
              Keep Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* ─── Breadcrumb ─── */}
      <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Link href="/cart" className="hover:text-primary-600">Cart</Link>
        <span>/</span>
        <span className="text-neutral-500">Checkout</span>
      </div>

      <CheckoutStepper currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Step Content Forms */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm">
          {step === 'shipping' && (
            <ShippingForm
              onSubmit={handleShippingSubmit}
              initialData={shippingData || undefined}
            />
          )}

          {step === 'payment' && (
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              onBack={() => setStep('shipping')}
              initialData={paymentData || undefined}
            />
          )}

          {step === 'review' && shippingData && paymentData && (
            <OrderReview
              shippingData={shippingData}
              paymentData={paymentData}
              cartItems={cart}
              totals={{ subtotal, shipping, tax, discount: discountAmount, total }}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setStep('payment')}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Right Side: Quick Subtotal Breakdown sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-neutral-150 bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Order Items ({cart.length})</h4>
            
            {/* Shortened items view */}
            <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0 items-center justify-between">
                  <span className="text-xs text-neutral-600 line-clamp-1 max-w-[200px]">
                    {item.name} <span className="font-bold text-neutral-400">×{item.quantity}</span>
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs text-neutral-500 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>COD Delivery Charge</span>
                <span className="font-semibold text-neutral-900">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-neutral-100 pt-2 flex justify-between font-extrabold text-sm text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-center p-3 text-[11px] text-neutral-400">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>Secure 256-bit SSL connection guaranteed.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
