import * as React from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { searchProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  return {
    title: query ? `Search: "${query}" | Antigravity Store` : 'Search Products | Antigravity Store',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* ─── Breadcrumb ─── */}
      <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <span className="text-neutral-500">Search</span>
      </div>

      {/* ─── Heading details ─── */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Search Results</h1>
        {query ? (
          <p className="text-sm text-neutral-500">
            Showing results for <span className="font-bold text-neutral-800">"{query}"</span>
          </p>
        ) : (
          <p className="text-sm text-neutral-500">Type in the header search bar to find products.</p>
        )}
      </div>

      {/* ─── Results Layout block ─── */}
      {query ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 text-sm text-neutral-500">
            <span className="font-bold text-neutral-800">{products.length}</span>
            <span>matches found</span>
          </div>
          
          <ProductGrid products={products} skeletonCount={4} />
        </div>
      ) : (
        <div className="mx-auto max-w-md text-center py-16 px-4 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Search catalog</h3>
            <p className="text-xs text-neutral-500 max-w-xs mt-1 leading-normal">
              Type product names, brands, or categories in the navigation search field above to begin.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
