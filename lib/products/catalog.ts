import { cache } from "react"
import { getSupabase } from "@/lib/supabase/server"
import { detectBrand, originLabels, productSlug, type CatalogProduct } from "./utils"

export type { CatalogProduct } from "./utils"

type CatalogRow = {
  id: string
  description: string
  origin: string | null
  updated_at: string
}

function mapRow(row: CatalogRow): CatalogProduct {
  const name = row.description.trim()
  const origin = (row.origin ?? "").trim()
  return {
    id: row.id,
    slug: productSlug(row.id, name),
    name,
    origin,
    originLabel: originLabels[origin.toLowerCase()] ?? origin,
    brand: detectBrand(name),
    updatedAt: row.updated_at,
  }
}

export const listCatalogProducts = cache(async (): Promise<CatalogProduct[]> => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Product catalog skipped: Supabase environment variables are not set")
    return []
  }
  const { data, error } = await getSupabase()
    .from("products")
    .select("id, description, origin, updated_at")
    .order("usage_count", { ascending: false })
    .order("description")
    .limit(5000)
  if (error) throw error
  return ((data ?? []) as CatalogRow[]).map(mapRow)
})

export async function getCatalogProductBySlug(slug: string) {
  let normalized = slug
  try {
    normalized = decodeURIComponent(slug)
  } catch {}
  normalized = normalized.normalize("NFKC")
  const products = await listCatalogProducts()
  return products.find((product) => product.slug === normalized) ?? null
}

export async function getProductImageDataUrl(id: string): Promise<string | null> {
  const { data, error } = await getSupabase().from("products").select("image_data_url").eq("id", id).maybeSingle()
  if (error) throw error
  return (data?.image_data_url as string | null | undefined) ?? null
}
