import type { Metadata } from 'next'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <Head>
        <script
          async
          src="https://unpkg.com/@phosphor-icons/web"></script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
