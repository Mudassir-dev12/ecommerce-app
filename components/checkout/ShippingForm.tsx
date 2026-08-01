'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { ShippingFormData } from '@/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  initialData?: Partial<ShippingFormData>;
}

export function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: 'Pakistan',
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-bold text-neutral-900">Shipping Information</h3>
        <p className="text-xs text-neutral-500 mt-1">Please enter your delivery address details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="Name"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="03000000000"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required' })}
        />
      </div>

      <div className="space-y-4">
        <Input
          label="Street Address"
          placeholder="123 Main St"
          error={errors.line1?.message}
          {...register('line1', { required: 'Street address is required' })}
        />
        <Input
          label="Apartment, suite, unit, etc. (optional)"
          placeholder="Apt 4B"
          error={errors.line2?.message}
          {...register('line2')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          placeholder="Karachi"
          error={errors.city?.message}
          {...register('city', { required: 'City is required' })}
        />
        <Input
          label="State / Province"
          placeholder="Sindh"
          error={errors.state?.message}
          {...register('state', { required: 'State is required' })}
        />
        <Input
          label="ZIP / Postal Code"
          placeholder="75500"
          error={errors.zip?.message}
          {...register('zip', { required: 'Zip code is required' })}
        />
      </div>

      <Input
        label="Country"
        placeholder="Pakistan"
        error={errors.country?.message}
        {...register('country', { required: 'Country is required' })}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
