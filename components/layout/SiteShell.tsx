'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <React.Suspense fallback={<div className="h-16 bg-white border-b border-neutral-100" />}>
        <Navbar />
      </React.Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
