import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://zooeyai.com'),
  title: 'Zooey — Intelligence That Lives on Your Desktop',
  description:
    'Zooey is an AI desktop assistant that understands your workflow, adapts to your world, and gets things done while you focus on what matters.',
  openGraph: {
    title: 'Zooey — AI Desktop Assistant',
    description: 'Intelligence that lives on your desktop.',
    url: 'https://zooeyai.com',
    siteName: 'Zooey',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zooey — AI Desktop Assistant',
    description: 'Intelligence that lives on your desktop.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
