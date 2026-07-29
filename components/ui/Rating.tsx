import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  reviewCount?: number;
  className?: string;
}

export function Rating({
  rating,
  max = 5,
  size = 'sm',
  showLabel = false,
  reviewCount,
  className,
}: RatingProps) {
  // Clamp rating to [0, max]
  const clampedRating = Math.min(Math.max(rating, 0), max);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.25 && clampedRating % 1 < 0.75;
  const extraFullStar = clampedRating % 1 >= 0.75 ? 1 : 0;
  
  const totalFull = fullStars + extraFullStar;
  const totalHalf = hasHalfStar ? 1 : 0;
  const totalEmpty = max - totalFull - totalHalf;

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center text-amber-400">
        {/* Full Stars */}
        {Array.from({ length: totalFull }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(starSizes[size], 'fill-current')}
          />
        ))}

        {/* Half Star */}
        {Array.from({ length: totalHalf }).map((_, i) => (
          <div key={`half-${i}`} className="relative">
            <Star className={cn(starSizes[size], 'text-neutral-300')} />
            <div className="absolute inset-0 overflow-hidden w-[50%] text-amber-400">
              <Star className={cn(starSizes[size], 'fill-current')} />
            </div>
          </div>
        ))}

        {/* Empty Stars */}
        {Array.from({ length: totalEmpty }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(starSizes[size], 'text-neutral-300')}
          />
        ))}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-neutral-600 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-neutral-400 font-normal">
              {' '}
              ({reviewCount.toLocaleString()})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
