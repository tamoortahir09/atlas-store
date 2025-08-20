import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas Rust',
  description: 'Official AtlasRust Store. Gear up for the fight!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Russo+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  );
}