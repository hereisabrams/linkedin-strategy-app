
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './global.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'LinkedIn Strategy Architect',
  description: 'An AI-powered assistant to help you build a winning LinkedIn strategy from the ground up, with personalized content ideas and daily growth tasks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-brand-background font-sans text-brand-text-primary">
        <Providers>
          {children}
        </Providers>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8258399315362229`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
