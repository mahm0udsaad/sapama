import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import {
  arabicSeoKeywords,
  companyName,
  getSiteUrl,
  siteDescription,
  siteTitle,
} from "@/lib/seo"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${companyName}`,
  },
  description: siteDescription,
  applicationName: companyName,
  referrer: "origin-when-cross-origin",
  keywords: arabicSeoKeywords,
  authors: [{ name: companyName }],
  creator: companyName,
  publisher: companyName,
  category: "Medical",
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/",
      ar: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: companyName,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${companyName} - حلول وتجهيزات طبية`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14215B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyName,
    url: siteUrl,
    inLanguage: "ar-SA",
    description: siteDescription,
    keywords: arabicSeoKeywords.join(", "),
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
