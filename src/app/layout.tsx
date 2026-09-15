import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'MMTC - Melyncrythan Musical Theatre Company',
    template: '%s | MMTC',
  },
  description:
    'Melyncrythan Musical Theatre Company - Bringing the magic of musical theatre to Neath and the surrounding valleys since 1923.',
  keywords: [
    'musical theatre',
    'Neath',
    'Wales',
    'amateur dramatics',
    'Gwyn Hall',
    'MMTC',
    'Melyncrythan',
  ],
  authors: [{ name: 'MMTC' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Melyncrythan Musical Theatre Company',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
