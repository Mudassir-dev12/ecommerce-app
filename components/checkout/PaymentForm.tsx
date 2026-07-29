'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { PaymentFormData } from '@/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
  initialData?: Partial<PaymentFormData>;
}

export function PaymentForm({ onSubmit, onBack, initialData }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      saveCard: false,
      ...initialData,
    },
  });

  // Simple formatter for Card Number (adds spaces every 4 digits)
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setValue('cardNumber', parts.join(' '));
    } else {
      setValue('cardNumber', value);
    }
  };

  // Simple formatter for Expiry Date (adds slash)
  const formatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length >= 2) {
      setValue('expiry', `${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setValue('expiry', value);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-bold text-neutral-900">Payment Details</h3>
        <p className="text-xs text-neutral-500 mt-1">Please enter your credit card details.</p>
      </div>

      <Input
        label="Name on Card"
        placeholder="John Doe"
        error={errors.cardName?.message}
        {...register('cardName', { required: 'Name on card is required' })}
      />

      <Input
        label="Card Number"
        placeholder="4111 2222 3333 4444"
        maxLength={19}
        error={errors.cardNumber?.message}
        {...register('cardNumber', {
          required: 'Card number is required',
          pattern: {
            value: /^[\d\s]{16,19}$/,
            message: 'Invalid card number format',
          },
        })}
        onChange={formatCardNumber}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Expiration Date"
          placeholder="MM/YY"
          maxLength={5}
          error={errors.expiry?.message}
          {...register('expiry', {
            required: 'Expiration date is required',
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: 'Format must be MM/YY',
            },
          })}
          onChange={formatExpiry}
        />
        <Input
          label="CVV"
          type="password"
          placeholder="•••"
          maxLength={4}
          error={errors.cvv?.message}
          {...register('cvv', {
            required: 'Security code (CVV) is required',
            pattern: {
              value: /^\d{3,4}$/,
              message: 'Must be 3 or 4 digits',
            },
          })}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="saveCard"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          {...register('saveCard')}
        />
        <label htmlFor="saveCard" className="text-sm text-neutral-600 cursor-pointer select-none">
          Save this card for future transactions
        </label>
      </div>

      <div className="flex justify-between items-center gap-4 pt-4 border-t border-neutral-100">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary">
          Review Order
        </Button>
      </div>
    </form>
  );
}
