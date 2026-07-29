import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckoutStepperProps {
  currentStep: 'shipping' | 'payment' | 'review';
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  const getStepIndex = (key: string) => steps.findIndex((s) => s.key === key);
  const activeIdx = getStepIndex(currentStep);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center max-w-xl mx-auto">
        
        {/* Connection Bar Background */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 -z-10" />

        {/* Connection Bar Progress */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary-600 -translate-y-1/2 -z-10 transition-all duration-500 ease-in-out"
          style={{
            width: activeIdx === 0 ? '0%' : activeIdx === 1 ? '50%' : '100%',
          }}
        />

        {/* Steps Bubbles */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isActive = idx === activeIdx;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ring-4 ring-white',
                  {
                    'bg-primary-600 text-white shadow-glow': isActive,
                    'bg-primary-600 text-white': isCompleted,
                    'bg-neutral-100 text-neutral-400 border border-neutral-200': !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn('text-xs font-semibold uppercase tracking-wider', {
                  'text-primary-600': isActive,
                  'text-neutral-500': isCompleted,
                  'text-neutral-400': !isActive && !isCompleted,
                })}
              >
                {step.label}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
