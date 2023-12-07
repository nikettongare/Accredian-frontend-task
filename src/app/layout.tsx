

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Accredian Task By Niket Tongare',
  description: 'Accredian Task By Niket Tongare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  )
}
