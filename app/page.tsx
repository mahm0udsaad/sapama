import type { Metadata } from "next"
import HomePageClient from "@/components/HomePageClient"
import { faqSchema, homeFaqs, siteDescription, siteTitle } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: siteTitle },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    ...faqSchema(homeFaqs),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient />
    </>
  )
}
