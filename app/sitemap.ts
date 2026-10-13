import type { MetadataRoute } from "next"
import { getSiteUrl, servicePages } from "@/lib/seo"
import { categoryPath, storeCategoryList } from "@/lib/store-categories"
import { getProducts, productImage, productPath } from "@/lib/store-catalog"

// Keep in step with catalogRevalidateSeconds in lib/store-catalog.ts.
export const revalidate = 21600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()
  const products = await getProducts()

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/images/hero-physiotherapy-equipment.webp`],
    },
    ...servicePages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [`${siteUrl}${page.image}`],
    })),
    { url: `${siteUrl}/products`, lastModified, changeFrequency: "daily", priority: 0.9 },
    ...storeCategoryList.map((category) => ({
      url: `${siteUrl}${categoryPath(category)}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((product) => {
      const image = productImage(product, 1200)
      return {
        url: `${siteUrl}${productPath(product)}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        ...(image && { images: [image] }),
      }
    }),
  ]
}
