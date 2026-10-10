"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { CatalogProduct } from "@/lib/products/utils"
import ProductCard from "./ProductCard"

export default function ProductsGrid({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => `${product.name} ${product.brand ?? ""} ${product.originLabel}`.toLowerCase().includes(term))
  }, [products, query])

  return (
    <>
      <label className="relative mx-auto mb-10 block max-w-xl">
        <span className="sr-only">ابحث في المنتجات</span>
        <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث باسم الجهاز أو الموديل أو الشركة"
          className="w-full rounded-full border border-border bg-card py-3 pl-4 pr-12 text-foreground shadow-sm outline-none focus:border-primary"
        />
      </label>
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد منتجات مطابقة لبحثك.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
