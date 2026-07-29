'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { useStore } from '@/lib/store';
import { useToast } from '../ui/Toast';
import { formatPrice } from '@/lib/utils';

export interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { toast } = useToast();
  const updateQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const handleQtyChange = (val: number) => {
    const nextQty = item.quantity + val;
    if (nextQty < 1) return;
    if (nextQty > item.maxStock) {
      toast(`Only ${item.maxStock} units of this item are available in stock.`, 'warning');
      return;
    }
    updateQuantity(item.id, nextQty);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    toast(`Removed "${item.name}" from your cart.`, 'info');
  };

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-neutral-100 last:border-0">
      
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-square h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 shrink-0"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-w-768px) 80px, 96px"
          className="object-cover object-center"
        />
      </Link>

      {/* Product Content Details */}
      <div className="flex flex-col justify-between flex-1 gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {item.brand}
            </span>
            <Link href={`/products/${item.slug}`} className="block">
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1">
                {item.name}
              </h4>
            </Link>
            {/* Selected variants */}
            {(item.selectedColor || item.selectedSize) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {item.selectedColor && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    Color:
                    <span
                      className="h-2 w-2 rounded-full border border-neutral-300"
                      style={{ backgroundColor: item.selectedColor }}
                    />
                  </span>
                )}
                {item.selectedSize && (
                  <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    Size: {item.selectedSize}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-base font-extrabold text-neutral-900 shrink-0">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {/* Quantity control and Remove button */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1">
            <button
              onClick={() => handleQtyChange(-1)}
              disabled={item.quantity <= 1}
              className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-neutral-800">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQtyChange(1)}
              disabled={item.quantity >= item.maxStock}
              className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-600 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>

      </div>

    </div>
  );
}
