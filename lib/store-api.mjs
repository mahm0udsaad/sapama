// Reads the public storefront API of the Salla store. Dependency-free so both the
// Next.js app and scripts/sync-store-catalog.mjs can import it.

const API_URL = "https://api.salla.dev/store/v1"
const STORE_ID = "1139437136"
const STORE_ORIGIN = "https://madmakvision.com"
const IMAGE_HOST = "https://cdn.salla.sa"

const headers = {
  "Store-Identifier": STORE_ID,
  Accept: "application/json",
  "Accept-Language": "ar",
  Origin: STORE_ORIGIN,
  Referer: `${STORE_ORIGIN}/`,
  "User-Agent": "Mozilla/5.0 (compatible; MadmakVisionCatalog/1.0; +https://madmakvi.com)",
}

/**
 * @typedef {{ type: "h" | "p" | "li"; text: string }} DescriptionBlock
 * @typedef {{
 *   id: string
 *   name: string
 *   slug: string
 *   storeUrl: string
 *   price: number
 *   regularPrice: number
 *   currency: string
 *   available: boolean
 *   image: string | null
 *   description: string
 *   blocks?: DescriptionBlock[]
 *   categoryIds: string[]
 * }} StoreProduct
 */

async function getJson(url) {
  const response = await fetch(url, { headers, cache: "no-store" })
  if (!response.ok) throw new Error(`Store API ${response.status} for ${url}`)
  const body = await response.json()
  if (!body?.success) throw new Error(`Store API returned an error for ${url}`)
  return body
}

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/gu

export function cleanText(text) {
  return String(text ?? "")
    .replace(EMOJI, "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
}

const stripTags = (html) =>
  cleanText(
    decodeEntities(
      html
        .replace(/<br\s*\/?>/gi, " ")
        // "<strong>Label</strong>text" would otherwise glue the label to the text.
        .replace(/<\/(strong|b)>(?=[^\s<.,،:؛!؟)])/gi, " ")
        .replace(/<[^>]+>/g, ""),
    ),
  )

/**
 * Turns the store's description HTML into plain text blocks, so no store HTML is rendered here.
 * @param {string} html
 * @param {string} [productName]
 * @returns {DescriptionBlock[]}
 */
export function htmlToBlocks(html, productName = "") {
  /** @type {DescriptionBlock[]} */
  const blocks = []
  const pattern = /<(p|li|h[1-6]|tr)\b[^>]*>([\s\S]*?)<\/\1>/gi
  for (const match of String(html ?? "").matchAll(pattern)) {
    const tag = match[1].toLowerCase()
    const inner = match[2]
    if (tag === "tr") {
      const cells = [...inner.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])).filter(Boolean)
      if (cells.length) blocks.push({ type: "li", text: cells.join(": ") })
      continue
    }
    const text = stripTags(inner)
    if (!text) continue
    const isBoldOnly = tag === "p" && /^\s*(?:<[^>]+>\s*)*<(strong|b)\b[^>]*>[\s\S]*<\/\1>\s*(?:<[^>]+>\s*)*$/i.test(inner)
    const type = tag.startsWith("h") || (isBoldOnly && text.length <= 80) ? "h" : tag === "li" ? "li" : "p"
    blocks.push({ type, text })
  }
  const name = cleanText(productName)
  return blocks.filter((block, index) => !(index === 0 && block.text === name))
}

function imagePath(raw) {
  const source = raw.original_image || raw.image?.url
  if (!source || !source.startsWith(IMAGE_HOST)) return null
  return source.slice(IMAGE_HOST.length)
}

/** Resized, modern-format variant of a store image. */
export function storeImage(path, width) {
  return `${IMAGE_HOST}/cdn-cgi/image/fit=scale-down,width=${width},height=${width},onerror=redirect,format=auto${path}`
}

function amount(value) {
  return typeof value === "object" && value !== null ? Number(value.amount) : Number(value)
}

/** @returns {Omit<StoreProduct, "categoryIds" | "blocks">} */
export function normalizeProduct(raw) {
  const id = String(raw.id)
  const storeUrl = String(raw.url)
  const storePath = decodeURI(new URL(storeUrl).pathname)
  const storeSlug = storePath.split("/").filter(Boolean)[0] ?? ""
  return {
    id,
    name: cleanText(raw.name),
    slug: `${storeSlug}-p${id}`,
    storeUrl: encodeURI(decodeURI(storeUrl)),
    price: amount(raw.price),
    regularPrice: amount(raw.regular_price ?? raw.price),
    currency: raw.currency || "SAR",
    available: Boolean(raw.is_available) && !raw.is_out_of_stock,
    image: imagePath(raw),
    description: cleanText(raw.description),
  }
}

async function fetchCategoryProducts(categoryId) {
  const products = []
  let url = `${API_URL}/products?source=categories&source_value[]=${categoryId}&per_page=32&page=1`
  for (let page = 0; url && page < 30; page += 1) {
    const body = await getJson(url)
    products.push(...(body.data ?? []))
    url = body.cursor?.next ?? null
  }
  return products
}

/**
 * Fetches every product of the given store categories with current price and availability.
 * @param {string[]} categoryIds
 * @returns {Promise<StoreProduct[]>}
 */
export async function fetchLiveProducts(categoryIds) {
  /** @type {Map<string, StoreProduct>} */
  const byId = new Map()
  const lists = await Promise.all(categoryIds.map((categoryId) => fetchCategoryProducts(categoryId)))
  for (const [index, categoryId] of categoryIds.entries()) {
    for (const raw of lists[index]) {
      const existing = byId.get(String(raw.id))
      if (existing) existing.categoryIds.push(categoryId)
      else byId.set(String(raw.id), { ...normalizeProduct(raw), categoryIds: [categoryId] })
    }
  }
  // The store lists a few products twice; keep one page per name and price.
  const seen = new Set()
  return [...byId.values()].filter((product) => {
    const key = `${product.name}|${product.price}`
    if (seen.has(key)) return false
    seen.add(key)
    return product.price > 0 && Boolean(product.name)
  })
}

/** @returns {Promise<string>} description HTML of one product */
export async function fetchProductDescriptionHtml(productId) {
  const body = await getJson(`${API_URL}/products/${productId}/details`)
  return String(body.data?.description ?? "")
}
