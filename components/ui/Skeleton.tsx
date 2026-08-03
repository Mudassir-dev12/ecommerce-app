import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('skeleton-shimmer rounded-xl bg-neutral-200/60', className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-card animate-fade-in space-y-4">
      <div className="relative">
        {/* Wishlist Heart Icon Circle Skeleton */}
        <div className="absolute right-2 top-2 z-10">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Badge Skeleton (Sold Out / New / Sale) */}
        <div className="absolute left-2 top-2 z-10">
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>

        {/* Product Picture Box Skeleton */}
        <Skeleton className="aspect-square w-full rounded-xl" />

        {/* Product Brand & Title Text Skeleton */}
        <div className="mt-3.5 space-y-2">
          {/* Brand Name Tag Skeleton */}
          <Skeleton className="h-3 w-16 rounded-full" />
          {/* Product Title Skeleton */}
          <Skeleton className="h-4.5 w-4/5 rounded-full" />
          
          {/* Rating Stars & Review Count Skeleton */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`star-skel-${i}`} className="h-3 w-3 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Price & Action Buttons Section Skeleton */}
      <div className="space-y-3 pt-1 border-t border-neutral-100/80">
        {/* Price & Discount Skeleton */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-12 rounded-full" />
        </div>

        {/* Add to Cart & Buy Now Buttons Skeleton (Separate Parts) */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={`grid-skel-${i}`} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Product Gallery & Thumbnails Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`thumb-skel-${i}`} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Side: Product Details & Variant Selectors Skeleton */}
        <div className="space-y-6">
          {/* Brand, Title & Rating Stars */}
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-8 w-4/5 rounded-full" />
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={`star-det-${i}`} className="h-4 w-4 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>

          {/* Price & Discount Badge Skeleton */}
          <div className="flex items-center gap-3 border-y border-neutral-100 py-4">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>

          {/* Color Selection Skeleton */}
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={`color-skel-${i}`} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <div className="flex gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={`size-skel-${i}`} className="h-10 w-14 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Stock Status Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20 rounded-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-32 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-full" />
            </div>
          </div>

          {/* Action Buttons: Wishlist Heart, Add to Cart, Buy Now Skeletons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-8 p-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header bar skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* 4 Stat KPI Card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`admin-kpi-${i}`} className="rounded-2xl border border-neutral-150 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-3.5 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Table & filter header skeleton */}
      <div className="rounded-2xl border border-neutral-150 bg-white p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* Rows skeleton */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`admin-row-${i}`} className="flex items-center justify-between py-3 border-b border-neutral-100 gap-4">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-5 w-44 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
