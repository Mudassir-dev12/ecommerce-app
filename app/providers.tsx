'use client';

import * as React from 'react';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Always wrap in ToastProvider to prevent context errors during server pre-renders.
  return (
    <ToastProvider>
      <div className={mounted ? '' : 'invisible'}>
        {children}
      </div>
    </ToastProvider>
  );
}
