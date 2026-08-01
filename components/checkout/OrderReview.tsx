'use client';

import * as React from 'react';
import Image from 'next/image';
import type { ShippingFormData, PaymentFormData, CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/Button';

export interface OrderReviewProps {
  shippingData: ShippingFormData;
  paymentData: PaymentFormData;
  cartItems: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  onPlaceOrder: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function OrderReview({
  shippingData,
  paymentData,
  cartItems,
  totals,
  onPlaceOrder,
  onBack,
  isSubmitting = false,
}: OrderReviewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-bold text-neutral-900">Review & Confirm</h3>
        <p className="text-xs text-neutral-500 mt-1">Please inspect details before completing payment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping summary */}
        <div className="rounded-xl border border-neutral-150 p-5 bg-white space-y-2">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Shipping Address</h4>
          <div className="text-sm text-neutral-600 space-y-0.5">
            <p className="font-semibold text-neutral-800">
              {shippingData.firstName} {shippingData.lastName}
            </p>
            <p>{shippingData.line1}</p>
            {shippingData.line2 && <p>{shippingData.line2}</p>}
            <p>
              {shippingData.city}, {shippingData.state} {shippingData.zip}
            </p>
            <p>{shippingData.country}</p>
            <p className="mt-2 text-xs font-medium text-neutral-400">Phone: {shippingData.phone}</p>
          </div>
        </div>

        {/* Payment summary */}
        <div className="rounded-xl border border-neutral-150 p-5 bg-white space-y-2">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Payment Details</h4>
          <div className="text-sm text-neutral-600 space-y-1">
            <p className="font-bold text-neutral-900">Cash on Delivery (COD)</p>
            <p className="text-xs text-neutral-500">
              You will pay cash when your package is delivered to your address.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                COD Delivery Charge: {formatPrice(300)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Items In Order</h4>
        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-150 bg-white p-4 max-h-72 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center justify-between">
              <div className="flex gap-3 items-center min-w-0">
                <div className="relative h-12 w-12 rounded-lg bg-neutral-50 overflow-hidden shrink-0 border">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-neutral-900 truncate">{item.name}</h5>
                  <p className="text-xs text-neutral-500">
                    Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-800 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing checklist breakdown */}
      <div className="rounded-xl border border-neutral-150 p-5 bg-neutral-50/50 space-y-3">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 font-medium">
            <span>Discount Applied</span>
            <span>-{formatPrice(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-neutral-600">
          <span>COD Delivery Charge</span>
          <span className="font-semibold text-neutral-900">{formatPrice(totals.shipping)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Tax</span>
          <span>{formatPrice(totals.tax)}</span>
        </div>
        <div className="border-t border-neutral-200 pt-3 flex justify-between font-extrabold text-neutral-900 text-lg">
          <span>Grand Total</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-4 border-t border-neutral-100">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onPlaceOrder}
          isLoading={isSubmitting}
          className="px-8 shadow-glow"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
