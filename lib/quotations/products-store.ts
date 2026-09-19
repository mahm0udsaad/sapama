import { randomUUID } from "node:crypto"
import { getSupabase } from "@/lib/supabase/server"
import type { Product, QuotationItem, VatRate } from "./types"

type ProductRow = {
  id: string
  description: string
  origin: string | null
  unit_price: number
  vat_rate: VatRate
  image_data_url: string | null
  created_at: string
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    description: row.description,
    origin: row.origin ?? "",
    unitPrice: row.unit_price,
    vatRate: row.vat_rate,
    imageDataUrl: row.image_data_url,
    createdAt: row.created_at,
  }
}

export async function listProducts(search = ""): Promise<Product[]> {
  const db = getSupabase()
  let query = db
    .from("products")
    .select("id, description, origin, unit_price, vat_rate, image_data_url, created_at")
    .order("usage_count", { ascending: false })
    .order("description")
    .limit(50)

  const term = search.trim()
  if (term) query = query.ilike("description", `%${term}%`)

  const { data, error } = await query
  if (error) throw error
  return ((data ?? []) as ProductRow[]).map(mapProduct)
}

export async function upsertProductsFromQuotation(items: QuotationItem[], actor: string) {
  const db = getSupabase()
  const now = new Date().toISOString()

  for (const item of items) {
    const description = item.description.trim()
    if (!description) continue

    const { data: existing } = await db
      .from("products")
      .select("id, usage_count")
      .ilike("description", description)
      .maybeSingle()

    if (existing) {
      await db
        .from("products")
        .update({
          origin: item.origin,
          unit_price: item.unitPrice,
          vat_rate: item.vatRate,
          image_data_url: item.imageDataUrl ?? null,
          usage_count: (existing.usage_count ?? 0) + 1,
          updated_at: now,
        })
        .eq("id", existing.id)
    } else {
      await db.from("products").insert({
        id: randomUUID(),
        description,
        origin: item.origin,
        unit_price: item.unitPrice,
        vat_rate: item.vatRate,
        image_data_url: item.imageDataUrl ?? null,
        usage_count: 1,
        created_by: actor,
        created_at: now,
        updated_at: now,
      })
    }
  }
}
