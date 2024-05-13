import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { env } from 'process'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.WEBSITE_NAME,
  description: process.env.WEBSITE_DESCRIPTION
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html data-theme="cupcake">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
