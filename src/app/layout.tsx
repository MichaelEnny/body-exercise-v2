import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { AuthInitializer } from '@/components/common/AuthInitializer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FitPlatform - Ultimate Workout & Wellness Platform | AI-Powered Fitness Tracking',
  description: 'Transform your fitness journey with personalized workout plans, advanced analytics, and seamless device sync. Join 10,000+ users achieving their goals with FitPlatform.',
  keywords: 'fitness app, workout tracker, personal trainer, health analytics, Apple Health, Google Fit, workout planner, fitness goals',
  authors: [{ name: 'FitPlatform Team' }],
  creator: 'FitPlatform',
  publisher: 'FitPlatform',
  openGraph: {
    title: 'FitPlatform - Your Ultimate Fitness Platform',
    description: 'AI-powered workout planning and progress tracking for fitness enthusiasts and personal trainers',
    images: ['/og-image.png'],
    type: 'website',
    url: 'https://fitplatform.com',
    siteName: 'FitPlatform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitPlatform - Ultimate Fitness Platform',
    description: 'Transform your fitness with AI-powered insights and personalized workout plans',
    images: ['/twitter-image.png'],
    creator: '@fitplatform',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FitPlatform",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web, iOS, Android",
  "url": "https://fitplatform.com",
  "description": "AI-powered fitness and wellness platform for workout planning and progress tracking",
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "2500",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "FitPlatform"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthInitializer />
        {children}
      </body>
    </html>
  )
}