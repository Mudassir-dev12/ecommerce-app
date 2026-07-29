import * as React from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/api';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSort } from '@/components/product/ProductSort';
import type { ProductFilters as FiltersType, SortOption } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
    layout?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await getCategories();

  // Read search parameter filters
  const category = searchParams.category;
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const rating = searchParams.rating ? parseFloat(searchParams.rating) : undefined;
  
  const sort = (searchParams.sort as SortOption) || 'featured';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const layout = (searchParams.layout as 'grid' | 'list') || 'grid';

  const filters: FiltersType = {
    category,
    minPrice,
    maxPrice,
    minRating: rating,
    inStock: false,
  };

  const perPage = 8;
  const { products, pagination } = await getProducts(filters, sort, page, perPage);

  // Helper to compile updated search parameters for sorting/layout buttons
  const getParamUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();
    
    // Copy current params
    if (category) params.set('category', category);
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    if (rating !== undefined) params.set('rating', rating.toString());
    params.set('sort', sort);
    params.set('page', page.toString());
    params.set('layout', layout);

    // Apply updates
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    return `/products?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* ─── Breadcrumb & Title ─── */}
      <div className="space-y-1.5">
        <div className="flex gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="text-neutral-500">Products</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Catalog</h1>
      </div>

      {/* ─── Main Grid Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Product Filters (desktop filter sidebar) */}
        <aside className="hidden lg:block lg:col-span-1 border border-neutral-150 rounded-2xl bg-white p-6 sticky top-24">
          <ProductFilters categories={categories} />
        </aside>

        {/* Right Side: Toolbar and Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Mobile Filter Toggle Drawer placeholder / accordion */}
          <details className="lg:hidden rounded-xl border bg-white p-4 group transition-all">
            <summary className="flex items-center justify-between font-bold text-sm text-neutral-700 cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters &amp; Settings</span>
              </span>
              <span className="text-xs text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <ProductFilters categories={categories} />
            </div>
          </details>

          {/* Desktop Toolbar controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
            <span className="text-sm font-medium text-neutral-500">
              Showing <span className="font-semibold text-neutral-800">{products.length}</span> of{' '}
              <span className="font-semibold text-neutral-800">{pagination.total}</span> products
            </span>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Sorting options */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline">Sort:</span>
                <ProductSort currentSort={sort} />
              </div>

              {/* Grid / List layout switcher */}
              <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
                <Link
                  href={getParamUrl({ layout: 'grid' })}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors hover:bg-neutral-100',
                    layout === 'grid' ? 'text-primary-600 bg-primary-50 hover:bg-primary-50' : 'text-neutral-400'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href={getParamUrl({ layout: 'list' })}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors hover:bg-neutral-100',
                    layout === 'list' ? 'text-primary-600 bg-primary-50 hover:bg-primary-50' : 'text-neutral-400'
                  )}
                  aria-label="List view"
                >
                  <List className="h-4.5 w-4.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* Product Cards Block */}
          <ProductGrid products={products} layout={layout} skeletonCount={8} />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
              
              {/* Previous page link */}
              {page > 1 ? (
                <Link href={getParamUrl({ page: (page - 1).toString() })}>
                  <Button variant="outline" size="sm" className="gap-1 px-3">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled className="gap-1 px-3">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              )}

              {/* Page numbers info */}
              <span className="text-sm font-semibold text-neutral-500">
                Page {page} of {pagination.totalPages}
              </span>

              {/* Next page link */}
              {page < pagination.totalPages ? (
                <Link href={getParamUrl({ page: (page + 1).toString() })}>
                  <Button variant="outline" size="sm" className="gap-1 px-3">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled className="gap-1 px-3">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
