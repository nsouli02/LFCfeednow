import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LFC Feed Now - Latest Liverpool FC News in Real Time',
  description: 'Get the latest Liverpool FC news, transfer updates, match reports, and rumors in real-time. Your ultimate source for LFC news aggregated from trusted sources.',
  keywords: ['Liverpool FC', 'LFC', 'Liverpool news', 'transfer news', 'football news', 'Premier League', 'Anfield', 'Liverpool transfers', 'LFC updates'],
  authors: [{ name: 'LFC Feed Now' }],
  creator: 'LFC Feed Now',
  publisher: 'LFC Feed Now',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LFC Feed Now - Latest Liverpool FC News in Real Time',
    description: 'Get the latest Liverpool FC news, transfer updates, match reports, and rumors in real-time. Your ultimate source for LFC news aggregated from trusted sources.',
    url: 'https://your-domain.com', // Replace with your actual domain
    siteName: 'LFC Feed Now',
    images: [
      {
        url: '/images.jfif',
        width: 1200,
        height: 630,
        alt: 'LFC Feed Now - Liverpool FC News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LFC Feed Now - Latest Liverpool FC News in Real Time',
    description: 'Get the latest Liverpool FC news, transfer updates, match reports, and rumors in real-time.',
    images: ['/images.jfif'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images.jfif',
    shortcut: '/images.jfif',
    apple: '/images.jfif',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}


