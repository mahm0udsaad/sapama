import type { Metadata } from "next"
import ProductsManager from "@/components/quotations/ProductsManager"
import { listProducts } from "@/lib/quotations/products-store"

export const metadata: Metadata = { title: "المنتجات", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  return <ProductsManager initialProducts={await listProducts()} />
}
