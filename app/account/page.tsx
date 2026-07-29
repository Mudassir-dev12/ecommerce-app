'use client';

import * as React from 'react';
import { Package, User as UserIcon, MapPin, ExternalLink, Calendar, Mail, Phone, Award } from 'lucide-react';
import { getCurrentUser, getOrders } from '@/lib/api';
import type { User, Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AccountPage() {
  const { toast } = useToast();
  
  // Data State
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Nav Tab state
  const [activeTab, setActiveTab] = React.useState<'orders' | 'profile' | 'addresses'>('orders');

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [userData, ordersData] = await Promise.all([
          getCurrentUser(),
          getOrders(),
        ]);
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
  }, [toast]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Profile changes updated successfully!', 'success');
  };

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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2 col-span-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="col-span-3 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* ─── Profile Overview Header ─── */}
      <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-neutral-100 pb-8">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary-100 bg-neutral-100 shrink-0">
          <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Hello, {user.firstName}!
          </h1>
          <p className="text-sm text-neutral-500">
            Member since {new Date(user.createdAt).getFullYear()} • Premium Customer
          </p>
        </div>
      </div>

      {/* ─── Main Tabs Panel ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 md:col-span-1 border-b md:border-b-0 md:border-r border-neutral-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <Package className="h-4.5 w-4.5" />
            <span>Orders History</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <UserIcon className="h-4.5 w-4.5" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <MapPin className="h-4.5 w-4.5" />
            <span>Addresses</span>
          </button>
        </nav>

        {/* Tab Detail Pane */}
        <div className="md:col-span-3 space-y-6">
          
          {/* ─── Orders Tab View ─── */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-neutral-900">Your Orders ({orders.length})</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50">
                  <p className="text-sm text-neutral-500">You haven't placed any orders yet.</p>
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
          )}

          {/* ─── Profile Tab View ─── */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b pb-3">Personal Profile</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      defaultValue={user.firstName}
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user.lastName}
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 pl-9 text-sm text-neutral-500 cursor-not-allowed"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={user.phone}
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 pl-9 text-sm focus:bg-white focus:outline-none"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-neutral-800 text-white font-bold text-xs px-4 py-2 hover:bg-neutral-900 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* ─── Addresses Tab View ─── */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900">Address Book</h2>
                <button
                  onClick={() => toast('Add address form would open.', 'info')}
                  className="rounded-lg border text-xs font-bold px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                >
                  Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="relative rounded-2xl border border-neutral-150 bg-white p-5 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-800">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-extrabold uppercase text-primary-600 bg-primary-50 rounded px-1.5 py-0.5">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-neutral-600 space-y-0.5 pt-2">
                      <p className="font-semibold text-neutral-950">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p>{addr.country}</p>
                      <p className="mt-2 text-xs font-medium text-neutral-400">Phone: {addr.phone}</p>
                    </div>

                    <div className="flex gap-4 text-xs font-bold text-neutral-400 pt-3 border-t">
                      <button onClick={() => toast('Edit address form would open.', 'info')} className="hover:text-primary-600 transition-colors">
                        Edit Address
                      </button>
                      <button onClick={() => toast('Address removed.', 'info')} className="hover:text-rose-600 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
