import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SchemaMarkup from '@/components/SchemaMarkup'
import { LanguageProvider } from '@/contexts/language-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://jimicar.com'),
  title: 'Jimi Car | Location de Voitures à Fès et au Maroc',
  description: 'Location de voitures à Fès et partout au Maroc. Prix compétitifs, large gamme de véhicules, service professionnel. تأجير السيارات في فاس والمغرب | Car Rental in Fès Morocco',
  keywords: 'location voiture fes, location voiture maroc, car rental fes, car rental morocco, rent a car fes, تأجير السيارات فاس, تأجير السيارات المغرب, location auto fes, voiture location maroc',
  alternates: {
    languages: {
      'fr': '/',
      'en': '/en',
      'ar': '/ar'
    },
  },
  openGraph: {
    title: 'Jimi Car | Location de Voitures à Fès et au Maroc',
    description: 'Location de voitures à Fès et partout au Maroc. Prix compétitifs, large gamme de véhicules, service professionnel.',
    url: 'https://jimicar.com',
    siteName: 'Jimi Car',
    locale: 'fr_MA',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jimi Car - Location de voitures au Maroc',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jimi Car | Location de Voitures à Fès',
    description: 'Location de voitures à Fès et partout au Maroc. Prix compétitifs, service professionnel.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://jimicar.com" />
        <link rel="shortcut icon" href="/favicon.ico" sizes="512x512" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="512x512" />
        <link rel="apple-touch-icon" href="/favicon.ico" sizes="512x512" />
        <SchemaMarkup />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
