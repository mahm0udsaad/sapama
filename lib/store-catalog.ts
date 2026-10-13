import { unstable_cache } from "next/cache"
import { cache } from "react"
import snapshot from "./store-catalog.snapshot.json"
import { fetchLiveProducts, storeImage } from "./store-api.mjs"
import { parentCategory, storeCategoryList, type StoreCategory } from "./store-categories"

export type DescriptionBlock = { type: "h" | "p" | "li"; text: string }

export type StoreProduct = {
  id: string
  name: string
  slug: string
  storeUrl: string
  price: number
  regularPrice: number
  currency: string
  available: boolean
  image: string | null
  description: string
  blocks?: DescriptionBlock[]
  categoryIds: string[]
}

/** Product and category pages re-read prices and stock from the store this often. */
export const catalogRevalidateSeconds = 21600

const snapshotProducts = snapshot.products as unknown as StoreProduct[]
const snapshotById = new Map(snapshotProducts.map((product) => [product.id, product]))

const loadLiveProducts = unstable_cache(
  async () => (await fetchLiveProducts(storeCategoryList.map((category) => category.id))) as StoreProduct[],
  ["store-catalog-v1"],
  { revalidate: catalogRevalidateSeconds },
)

export const getProducts = cache(async (): Promise<StoreProduct[]> => {
  // Builds use the committed snapshot so they never depend on the store being reachable.
  // Deployed pages pick up live prices and stock on revalidation.
  if (process.env.NEXT_PHASE === "phase-production-build") return snapshotProducts
  try {
    const live = await loadLiveProducts()
    if (live.length === 0) return snapshotProducts
    return live.map((product) => ({ ...product, blocks: snapshotById.get(product.id)?.blocks }))
  } catch {
    return snapshotProducts
  }
})

export async function getProductBySlug(slugParam: string) {
  let slug = slugParam
  try {
    slug = decodeURIComponent(slugParam)
  } catch {
    // keep the raw value
  }
  const id = slug.match(/-p(\d+)$/)?.[1]
  if (!id) return undefined
  return (await getProducts()).find((product) => product.id === id)
}

export async function getCategoryProducts(category: StoreCategory) {
  const products = (await getProducts()).filter((product) => product.categoryIds.includes(category.id))
  return [...products.filter((product) => product.available), ...products.filter((product) => !product.available)]
}

const depth = (category: StoreCategory): number => {
  const parent = parentCategory(category)
  return parent ? depth(parent) + 1 : 0
}

/** Categories of a product, most specific first. */
export function productCategories(product: StoreProduct) {
  return storeCategoryList
    .filter((category) => product.categoryIds.includes(category.id))
    .sort((a, b) => depth(b) - depth(a))
}

export const productPath = (product: StoreProduct) => `/products/${encodeURIComponent(product.slug)}`

export function productImage(product: StoreProduct, width: number) {
  return product.image ? storeImage(product.image, width) : null
}

/** Store product page with campaign parameters so referrals can be measured. */
export function productBuyUrl(product: StoreProduct) {
  return `${product.storeUrl}?utm_source=madmakvi.com&utm_medium=referral&utm_campaign=product-page`
}

export function formatPrice(product: Pick<StoreProduct, "price" | "currency">) {
  const value = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(product.price)
  return `${value} ${product.currency === "SAR" ? "ر.س" : product.currency}`
}

export function productSummary(product: StoreProduct, maxLength = 155) {
  const text = product.blocks?.find((block) => block.type === "p")?.text || product.description
  if (!text) return `${product.name} من مدماك فيجن: السعر والمواصفات والطلب المباشر من المتجر مع توصيل داخل المملكة.`
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`
}
