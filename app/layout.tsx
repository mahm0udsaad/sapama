import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'مدماك فيجن - منتجات وأجهزة الرعاية الصحية',
  description: 'نوفر منتجات علاج طبيعي وأجهزة، منتجات رعاية نهارية وأجهزة، ومنتجات رعاية كبار سن وأجهزة في المملكة العربية السعودية',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="theme-color" content="#14215B" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
