import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { SiteShell } from '@/components/layout/SiteShell';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Modern Traders - Womens Arrival | Luxury Women Fashion',
  description: 'Shop luxury women dresses, pret collection, couture and boutique fashion at Modern Traders - Womens Arrival.',
  icons: {
    icon: '/logo1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased font-sans">
        <Providers>
          <SiteShell>
            {children}
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
