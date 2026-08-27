import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: 'ClearList — Todo Management',
  description: 'A focused workspace for creating, updating, and completing everyday tasks.',
  openGraph: {
    title: 'ClearList — Make today count.',
    description: 'Create, update, complete, search, and organize todos in one focused workspace.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ClearList — Make today count.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearList — Make today count.',
    description: 'Create, update, complete, search, and organize todos in one focused workspace.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
