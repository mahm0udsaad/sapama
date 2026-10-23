import type { MetadataRoute } from "next"
import { getSiteUrl, servicePages } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/assets/images/hero-physiotherapy-clinic.webp`],
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...servicePages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [`${siteUrl}${page.image}`],
    })),
  ]
}
