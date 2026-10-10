import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Phone } from "lucide-react"
import ProductCard from "@/components/products/ProductCard"
import { getCatalogProductBySlug, listCatalogProducts } from "@/lib/products/catalog"
import { productDescription, productImagePath, productKeywords } from "@/lib/products/utils"
import { companyName, contactPhone, contactPhoneIntl, getSiteUrl } from "@/lib/seo"

export const revalidate = 3600

const siteUrl = getSiteUrl()

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await listCatalogProducts()).map((product) => ({ slug: product.slug }))
  } catch (error) {
    console.warn("Skipping product prerender", error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getCatalogProductBySlug((await params).slug)
  if (!product) return { title: "المنتج غير موجود", robots: { index: false, follow: true } }

  const description = productDescription(product)
  const path = `/products/${product.slug}`
  const image = productImagePath(product)
  return {
    title: product.name,
    description,
    keywords: productKeywords(product),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: `${siteUrl}${path}`,
      title: product.name,
      description,
      siteName: companyName,
      images: [{ url: image, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title: product.name, description, images: [image] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getCatalogProductBySlug((await params).slug)
  if (!product) notFound()

  const all = await listCatalogProducts()
  const others = all.filter((item) => item.id !== product.id)
  const related = [
    ...others.filter((item) => product.brand && item.brand === product.brand),
    ...others.filter((item) => !product.brand || item.brand !== product.brand),
  ].slice(0, 8)

  const url = `${siteUrl}/products/${product.slug}`
  const description = productDescription(product)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description,
    url,
    image: [`${siteUrl}${productImagePath(product)}`],
    sku: product.id,
    category: "أجهزة ومعدات العلاج الطبيعي",
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.originLabel ? { countryOfOrigin: product.originLabel } : {}),
    seller: { "@type": "Organization", name: companyName, url: siteUrl, telephone: contactPhoneIntl },
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "المنتجات", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav aria-label="مسار التنقل" className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">الرئيسية</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-primary">المنتجات</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <article className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-3xl border border-border bg-white p-6">
          <img src={productImagePath(product)} alt={product.name} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold leading-relaxed text-foreground md:text-3xl">{product.name}</h1>
          <p className="leading-loose text-muted-foreground">{description}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl bg-muted/60 p-5 text-sm">
            {product.brand && (
              <>
                <dt className="font-bold text-foreground">الشركة المصنعة</dt>
                <dd className="text-muted-foreground">{product.brand}</dd>
              </>
            )}
            {product.originLabel && (
              <>
                <dt className="font-bold text-foreground">بلد المنشأ</dt>
                <dd className="text-muted-foreground">{product.originLabel}</dd>
              </>
            )}
            <dt className="font-bold text-foreground">التوريد</dt>
            <dd className="text-muted-foreground">جميع مناطق المملكة العربية السعودية</dd>
            <dt className="font-bold text-foreground">الخدمات</dt>
            <dd className="text-muted-foreground">توريد، تركيب، تدريب، ضمان ودعم فني</dd>
          </dl>
          <div className="flex flex-wrap gap-3">
            <a href="/#contact" className="btn-primary">اطلب عرض سعر</a>
            <a href={`tel:${contactPhone}`} className="btn-secondary inline-flex items-center gap-2">
              <Phone size={18} aria-hidden="true" />
              <span dir="ltr">{contactPhone}</span>
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-products">
          <h2 id="related-products" className="mb-6 text-2xl font-bold text-foreground">منتجات ذات صلة</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
