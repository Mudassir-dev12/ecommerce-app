'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton, ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function WishlistPage() {
  const { toast } = useToast();
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);

  const [showSkeleton, setShowSkeleton] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClearAll = () => {
    wishlist.forEach((item) => {
      removeFromWishlist(item.productId);
    });
    toast('Your wishlist has been cleared.', 'info');
  };

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 animate-pulse-slow">
          <Heart className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Your Wishlist is Empty</h2>
          <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
            You haven't saved any products to your wishlist yet. Tap the heart on products you love to save them here!
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" className="gap-2 px-6 shadow-glow">
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Discover Products</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* ─── Header Title ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Wishlist</h1>
          <p className="text-sm text-neutral-500">
            You have <span className="font-semibold text-neutral-850">{wishlist.length}</span> item(s) saved
          </p>
        </div>
        
        <button
          onClick={handleClearAll}
          className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors border border-rose-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg shrink-0"
        >
          Clear All Items
        </button>
      </div>

      {/* ─── Wishlist Items Grid ─── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {wishlist.map((item) => {
          // Re-create simple product object mock to feed to ProductCard
          const mockProduct = {
            id: item.productId,
            slug: item.slug,
            name: item.name,
            brand: item.brand,
            description: '',
            longDescription: '',
            price: item.price,
            originalPrice: item.originalPrice,
            category: '',
            categorySlug: '',
            tags: [],
            images: [{ id: 'wl-img', url: item.image, alt: item.name, isPrimary: true }],
            variants: [],
            rating: item.rating,
            reviewCount: 0,
            inStock: item.inStock,
            stockCount: 10,
            createdAt: item.addedAt,
            sku: '',
          };

          return <ProductCard key={item.productId} product={mockProduct} layout="grid" />;
        })}
      </div>

    </div>
  );
}
