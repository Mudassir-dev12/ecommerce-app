import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Modern Traders - Womens Arrival | Luxury Women Fashion',
  description: 'Shop luxury women dresses, pret collection, couture and boutique fashion at Modern Traders - Womens Arrival.',
  icons: {
    icon: '/pnglogo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 antialiased font-sans">
        <Providers>
          <Suspense fallback={<div className="h-16 bg-white border-b border-neutral-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
