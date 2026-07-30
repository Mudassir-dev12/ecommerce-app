'use client';

import * as React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      toast: (message: string) => {
        if (typeof window !== 'undefined') {
          console.log('[Toast]:', message);
        }
      },
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-950',
    error: 'bg-rose-50 border-rose-100 text-rose-950',
    warning: 'bg-amber-50 border-amber-100 text-amber-950',
    info: 'bg-blue-50 border-blue-100 text-blue-950',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 w-full rounded-xl border p-4 shadow-xl animate-bounce-in bg-white',
        bgStyles[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm font-medium leading-5">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
