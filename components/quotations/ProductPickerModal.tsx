"use client"

import { useEffect, useState } from "react"
import { PackagePlus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatMoney } from "@/lib/quotations/calculations"
import type { Product } from "@/lib/quotations/types"

export default function ProductPickerModal({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (product: Product) => void
}) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`)
        const result = await response.json()
        if (!cancelled) setProducts(result.products ?? [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [open, query])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>اختيار منتج من القائمة</DialogTitle>
        </DialogHeader>
        <label className="relative block">
          <span className="sr-only">البحث في المنتجات</span>
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث بوصف المنتج"
            className="admin-input pr-10"
          />
        </label>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {loading ? <p className="py-6 text-center text-sm text-muted-foreground">جارٍ البحث...</p> : null}
          {!loading && !products.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {query ? "لا توجد نتائج مطابقة." : "لا توجد منتجات محفوظة بعد. أضف منتجاً يدوياً وسيُحفظ تلقائياً."}
            </p>
          ) : null}
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onSelect(product)
                onOpenChange(false)
              }}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border p-3 text-right transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span>
                <span className="block font-semibold">{product.description}</span>
                {product.origin ? <span className="block text-xs text-muted-foreground">{product.origin}</span> : null}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-primary">
                {formatMoney(product.unitPrice)} ر.س <PackagePlus className="size-4" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
