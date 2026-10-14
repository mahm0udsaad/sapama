import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import {
  arabicSeoKeywords,
  companyName,
  companyNameEn,
  getSiteUrl,
  ogImage,
  organizationId,
  organizationSchema,
  siteDescription,
  siteTitle,
  trackingIds,
  websiteId,
} from "@/lib/seo"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
// Font of the landing page; public pages use it through the .site-theme class.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-arabic",
})
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
  authors: [{ name: companyName, url: siteUrl }],
  creator: companyName,
  publisher: companyName,
  category: "Medical Equipment",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: companyName,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@madmakvi",
    creator: "@madmakvi",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage.url],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId(siteUrl),
        name: companyName,
        alternateName: companyNameEn,
        url: siteUrl,
        inLanguage: "ar-SA",
        description: siteDescription,
        publisher: { "@id": organizationId(siteUrl) },
      },
      organizationSchema(siteUrl),
    ],
  }

  return (
    <html lang="ar" dir="rtl">
      <body className={`${plexArabic.variable} font-sans antialiased`}>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${trackingIds.gtm}');`}
        </Script>
        <Script
          id="google-ads-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingIds.googleAds}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${trackingIds.googleAds}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${trackingIds.gtm}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
