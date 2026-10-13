import { formatPrice, productImage, productPath, type StoreProduct } from "@/lib/store-catalog"

export default function ProductCard({ product }: { product: StoreProduct }) {
  const image = productImage(product, 400)

  return (
    <a href={productPath(product)} className="service-card flex flex-col group">
      <div className="aspect-square bg-white flex items-center justify-center p-4 border-b border-gray-100">
        {image ? (
          // Store images come resized from the store CDN; next/image is unoptimized in this project.
          <img
            src={image}
            alt={product.name}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-sm text-muted-foreground">لا توجد صورة</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-foreground leading-snug line-clamp-2">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-primary font-bold" dir="rtl">
            {formatPrice(product)}
          </span>
          {!product.available && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">غير متوفر حاليًا</span>
          )}
        </div>
      </div>
    </a>
  )
}
