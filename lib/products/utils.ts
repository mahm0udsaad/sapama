import { companyName } from "@/lib/seo"

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  origin: string
  originLabel: string
  brand: string | null
  updatedAt: string
}

export const originLabels: Record<string, string> = {
  uk: "المملكة المتحدة",
  "united kingdom": "المملكة المتحدة",
  england: "المملكة المتحدة",
  usa: "الولايات المتحدة",
  us: "الولايات المتحدة",
  "united states": "الولايات المتحدة",
  china: "الصين",
  germany: "ألمانيا",
  italy: "إيطاليا",
  turkey: "تركيا",
  taiwan: "تايوان",
  korea: "كوريا",
  "south korea": "كوريا الجنوبية",
  japan: "اليابان",
  india: "الهند",
  spain: "إسبانيا",
  france: "فرنسا",
  "czech republic": "التشيك",
  czech: "التشيك",
  ksa: "السعودية",
  "saudi arabia": "السعودية",
  saudi: "السعودية",
  egypt: "مصر",
  pakistan: "باكستان",
}

const knownBrands = ["BTL", "Chattanooga", "Enraf-Nonius", "Gymna", "Zimmer", "Shinysport", "Shiny Sport", "Storz", "Meden-Inmed"]

export function productSlug(id: string, name: string) {
  const base = name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")
  const suffix = id.replace(/-/g, "").slice(0, 8)
  return base ? `${base}-${suffix}` : suffix
}

export function detectBrand(name: string) {
  const match = knownBrands.find((brand) => new RegExp(`\\b${brand.replace(/[-\s]/g, "[-\\s]?")}\\b`, "i").test(name))
  return match ? match.replace(/\s/g, "") : null
}

export function productImagePath(product: Pick<CatalogProduct, "slug">) {
  return `/products/${product.slug}/image`
}

export function productDescription(product: CatalogProduct) {
  const parts = [`${product.name} متوفر لدى ${companyName} في المملكة العربية السعودية`]
  if (product.brand) parts.push(`من ${product.brand}`)
  if (product.originLabel) parts.push(`بلد المنشأ: ${product.originLabel}`)
  return `${parts.join(" – ")}. توريد وتركيب وضمان ودعم فني لمراكز العلاج الطبيعي والمستشفيات والرعاية النهارية. اطلب عرض سعر الآن.`
}

export function productKeywords(product: CatalogProduct) {
  const keywords = [
    product.name,
    `سعر ${product.name}`,
    `شراء ${product.name}`,
    `${product.name} السعودية`,
    "أجهزة علاج طبيعي",
    "معدات العلاج الطبيعي",
    "توريد أجهزة علاج طبيعي",
    "مستلزمات طبية",
  ]
  const latinModel = product.name.match(/[A-Za-z][A-Za-z0-9 .\-()/]{2,}/g)
  if (latinModel) keywords.push(...latinModel.map((value) => value.trim()))
  if (product.brand) keywords.push(product.brand, `أجهزة ${product.brand}`)
  return Array.from(new Set(keywords))
}
