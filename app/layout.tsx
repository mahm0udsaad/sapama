import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'سباما ميديكال - تجهيزات مراكز العلاج الطبيعي',
  description: 'متخصصون في توفير أجهزة ومعدات العلاج الطبيعي والتأهيل الشامل بالمملكة العربية السعودية',
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
