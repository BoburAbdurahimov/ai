/**
 * Root Layout - Next.js 14 App Router
 * Main application shell with providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/lib/animations/micro-animations.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'VoiceOps AI - AI-Powered Call Center for Healthcare',
    template: '%s | VoiceOps AI',
  },
  description: 'Russian AI call handling with Uzbek language support for healthcare clinics across Uzbekistan',
  keywords: ['AI call center', 'healthcare', 'Uzbekistan', 'Russian AI', 'medical clinic'],
  authors: [{ name: 'VoiceOps AI' }],
  creator: 'VoiceOps AI',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://voiceops.ai',
    title: 'VoiceOps AI - AI Call Center for Healthcare',
    description: 'Russian AI call handling with Uzbek support',
    siteName: 'VoiceOps AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceOps AI',
    description: 'AI-Powered Call Center for Healthcare',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
