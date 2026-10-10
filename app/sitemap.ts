import type { MetadataRoute } from "next"
import { listCatalogProducts } from "@/lib/products/catalog"
import { productImagePath } from "@/lib/products/utils"
import { getSiteUrl } from "@/lib/seo"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const products = await listCatalogProducts().catch((error) => {
    console.warn("Sitemap built without products", error)
    return []
  })

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: encodeURI(`${siteUrl}/products/${product.slug}`),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [encodeURI(`${siteUrl}${productImagePath(product)}`)],
    })),
  ]
}
