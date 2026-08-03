'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calendar, ShoppingBag, Package } from 'lucide-react';
import { getCurrentUser, getOrders } from '@/lib/api';
import type { User, Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AccountPage() {
  const { toast } = useToast();
  
  // Data State
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        const ordersData = await getOrders(userData.id);
        setUser(userData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
        toast('Error loading account information.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    const handleOrderPlaced = () => {
      loadData();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('order-placed', handleOrderPlaced);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('order-placed', handleOrderPlaced);
      }
    };
  }, [toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
      case 'confirmed':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* ─── Header ─── */}
      <div className="border-b border-neutral-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Order History
            </h1>
            <Badge variant="secondary" className="text-[11px] font-mono">
              Device Guest Account
            </Badge>
          </div>
          <p className="text-xs text-neutral-500">
            Device Guest ID: <span className="font-mono text-neutral-700 font-semibold">{user.id}</span>
          </p>
        </div>

        <Link href="/products">
          <Button variant="secondary" size="sm" className="text-xs font-semibold">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* ─── Order History Section ─── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-600" />
            <span>Your Device Orders ({orders.length})</span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-800">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Orders placed on this device will automatically appear here in your personal device history.
              </p>
            </div>
            <Link href="/products" className="inline-block">
              <Button variant="primary" className="text-xs font-bold px-6">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="rounded-2xl border border-neutral-150 bg-white p-5 space-y-4 shadow-sm hover:shadow transition-shadow">
                {/* Order Info Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-100 pb-3 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-neutral-900">{ord.orderNumber}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(ord.createdAt)}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(ord.status)}>
                    {ord.status}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {ord.items.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center justify-between">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="relative h-12 w-12 rounded-lg bg-neutral-50 border overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{item.name}</h4>
                          <p className="text-[10px] text-neutral-500">
                            Quantity: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-neutral-800">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order tracking footer */}
                <div className="border-t border-neutral-100 pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="text-neutral-500">
                    {ord.trackingNumber && (
                      <p className="flex items-center gap-1 font-semibold">
                        <span>Tracking:</span>
                        <span className="font-mono text-neutral-800">{ord.trackingNumber}</span>
                      </p>
                    )}
                    {ord.estimatedDelivery && (
                      <p className="text-[10px] mt-0.5">Est. Delivery: {formatDate(ord.estimatedDelivery)}</p>
                    )}
                  </div>
                  <span className="text-sm font-extrabold text-neutral-950 self-end sm:self-auto">
                    Total Paid: {formatPrice(ord.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
