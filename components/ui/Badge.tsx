import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        {
          'bg-primary-50 text-primary-700 border border-primary-200': variant === 'primary',
          'bg-accent-50 text-accent-800 border border-accent-200': variant === 'secondary',
          'bg-emerald-50 text-emerald-700 border border-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-800 border border-amber-200': variant === 'warning',
          'bg-rose-50 text-rose-700 border border-rose-200': variant === 'danger',
          'bg-neutral-100 text-neutral-800 border border-neutral-200': variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  );
}
