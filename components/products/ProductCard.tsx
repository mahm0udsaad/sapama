import type { CatalogProduct } from "@/lib/products/utils"
import { productImagePath } from "@/lib/products/utils"

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <a
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex aspect-square items-center justify-center bg-white p-4">
        <img
          src={productImagePath(product)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-3 text-base font-bold leading-relaxed text-foreground">{product.name}</h2>
        <div className="mt-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
          {product.brand && <span className="rounded-full bg-muted px-2 py-1">{product.brand}</span>}
          {product.originLabel && <span className="rounded-full bg-muted px-2 py-1">المنشأ: {product.originLabel}</span>}
        </div>
      </div>
    </a>
  )
}
