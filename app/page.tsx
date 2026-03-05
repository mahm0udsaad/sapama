import type { Metadata } from "next"
import HomePageClient from "@/components/HomePageClient"
import {
  arabicSeoKeywords,
  companyName,
  getSiteUrl,
  siteDescription,
  siteTitle,
} from "@/lib/seo"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: arabicSeoKeywords,
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
        alt: `${companyName} - تجهيزات طبية متكاملة`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo.png"],
  },
}

export default function Home() {
  return <HomePageClient />
}
