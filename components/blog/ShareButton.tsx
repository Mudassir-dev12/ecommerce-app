'use client';

import * as React from 'react';
import { Share2 } from 'lucide-react';

export function ShareButton() {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-[#131213] hover:text-[#131213] shadow-sm transition-colors"
      aria-label="Share article"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
