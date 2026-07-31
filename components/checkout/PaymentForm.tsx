'use client';

import * as React from 'react';
import type { PaymentFormData } from '@/types';
import { Button } from '../ui/Button';
import { Banknote, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';

export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
  initialData?: Partial<PaymentFormData>;
}

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      method: 'Cash on Delivery (COD)',
      cardNumber: 'COD',
      cardName: 'Cash on Delivery',
      expiry: '',
      cvv: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-bold text-neutral-900">Payment Method</h3>
        <p className="text-xs text-neutral-500 mt-1">
          Select your preferred payment method to proceed with checkout.
        </p>
      </div>

      {/* COD Payment Option Card */}
      <div className="rounded-2xl border-2 border-primary-500 bg-primary-50/40 p-5 space-y-4 shadow-sm relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shrink-0">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-neutral-900">Cash on Delivery (COD)</h4>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Enabled
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Pay in cash when your order is delivered directly to your doorstep.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-primary-700 bg-white border border-primary-200 px-2.5 py-1 rounded-lg shadow-2xs">
              +$300 Delivery Fee
            </span>
          </div>
        </div>

        <div className="border-t border-primary-100/80 pt-3.5 flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
            <Truck className="h-4 w-4 text-primary-600" />
            <span>Delivery Charge: <strong className="text-primary-700 font-extrabold">$300.00</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Safe & Verified</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-4 border-t border-neutral-100">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" className="px-6 shadow-glow">
          Continue to Order Review
        </Button>
      </div>
    </form>
  );
}
