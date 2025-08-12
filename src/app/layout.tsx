import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LFC news only',
  description: 'Liverpool FC transfer headlines and latest updates',
  icons: {
    icon: '/lfc.jpg',
    shortcut: '/lfc.jpg',
    apple: '/lfc.jpg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}


