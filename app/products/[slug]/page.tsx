import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2, ShoppingCart } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/catalog/Breadcrumbs"
import ProductCard from "@/components/catalog/ProductCard"
import { breadcrumbSchema, companyName, contactInfo, getSiteUrl, organizationId, servicePageForCategory } from "@/lib/seo"
import { categoryPath, parentCategory } from "@/lib/store-categories"
import {
  formatPrice,
  getCategoryProducts,
  getProductBySlug,
  getProducts,
  productBuyUrl,
  productCategories,
  productImage,
  productPath,
  productSummary,
  type DescriptionBlock,
} from "@/lib/store-catalog"

// Keep in step with catalogRevalidateSeconds in lib/store-catalog.ts.
export const revalidate = 21600

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  if (!product) return {}

  const title = `${product.name} | السعر والمواصفات`
  const description = productSummary(product)
  const image = productImage(product, 1200)

  return {
    title,
    description,
    alternates: { canonical: productPath(product) },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: productPath(product),
      siteName: companyName,
      title: `${product.name} | ${companyName}`,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${companyName}`,
      description,
      images: image ? [image] : undefined,
    },
  }
}

/** Groups consecutive list items so each run renders as one list. */
function groupBlocks(blocks: DescriptionBlock[]) {
  const groups: ({ type: "h" | "p"; text: string } | { type: "list"; items: string[] })[] = []
  for (const block of blocks) {
    const last = groups[groups.length - 1]
    if (block.type === "li") {
      if (last?.type === "list") last.items.push(block.text)
      else groups.push({ type: "list", items: [block.text] })
    } else {
      groups.push({ type: block.type, text: block.text })
    }
  }
  return groups
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug((await params).slug)
  if (!product) notFound()

  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}${productPath(product)}`
  const categories = productCategories(product)
  const category = categories[0]
  const parent = category && parentCategory(category)
  const guide = category && servicePageForCategory(category)
  const related = category
    ? (await getCategoryProducts(category)).filter((item) => item.id !== product.id).slice(0, 4)
    : []
  const image = productImage(product, 800)
  const summary = productSummary(product, 300)
  const blocks = product.blocks?.length
    ? product.blocks
    : product.description
      ? [{ type: "p" as const, text: product.description }]
      : []

  const crumbs = [
    { name: "المنتجات", path: "/products" },
    ...(parent ? [{ name: parent.name, path: categoryPath(parent) }] : []),
    ...(category ? [{ name: category.name, path: categoryPath(category) }] : []),
    { name: product.name, path: productPath(product) },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: product.name,
        description: summary,
        sku: product.id,
        url: pageUrl,
        ...(image && { image: [productImage(product, 1200)] }),
        ...(category && { category: category.name }),
        offers: {
          "@type": "Offer",
          url: product.storeUrl,
          price: product.price,
          priceCurrency: product.currency,
          availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": organizationId(siteUrl) },
        },
      },
      breadcrumbSchema(siteUrl, crumbs),
    ],
  }

  return (
    <div className="w-full bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navigation />

      <main>
        <section className="bg-gradient-to-b from-secondary/50 to-background pt-10 pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={crumbs} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-center aspect-square w-full max-w-sm mx-auto md:max-w-none">
                {image ? (
                  <img
                    src={image}
                    alt={product.name}
                    width={800}
                    height={800}
                    fetchPriority="high"
                    className="max-h-full w-auto object-contain"
                  />
                ) : (
                  <span className="text-muted-foreground">لا توجد صورة</span>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{product.name}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((item) => (
                    <a
                      key={item.slug}
                      href={categoryPath(item)}
                      className="text-sm bg-primary/10 text-primary rounded-full px-3 py-1 hover:bg-primary/20 transition"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product)}</span>
                  <span
                    className={`text-sm font-semibold rounded-full px-3 py-1 ${
                      product.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.available ? "متوفر" : "غير متوفر حاليًا"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  السعر والتوفر كما في متجر {companyName}، ويُعتمد السعر النهائي عند إتمام الطلب في المتجر.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{summary}</p>

                <div className="flex gap-4 flex-wrap">
                  <a href={productBuyUrl(product)} className="btn-primary inline-flex items-center gap-2 group">
                    <ShoppingCart size={20} />
                    {product.available ? "اشترِ الآن من المتجر" : "عرض المنتج في المتجر"}
                  </a>
                  <a href="/#contact" className="btn-secondary">
                    اطلب عرض سعر
                  </a>
                </div>
                <p className="mt-6 text-muted-foreground">
                  للاستفسار:{" "}
                  <a href={`tel:${contactInfo.phoneIntl}`} dir="ltr" className="font-bold text-primary">
                    {contactInfo.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {blocks.length > 0 && (
          <section className="py-14 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">وصف {product.name}</h2>
              <div className="space-y-5">
                {groupBlocks(blocks).map((group, index) => {
                  if (group.type === "h") {
                    return (
                      <h3 key={index} className="text-xl font-bold text-foreground pt-3">
                        {group.text}
                      </h3>
                    )
                  }
                  if (group.type === "list") {
                    return (
                      <ul key={index} className="space-y-3">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={index} className="text-muted-foreground leading-loose">
                      {group.text}
                    </p>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {guide && (
              <a
                href={`/${guide.slug}`}
                className="service-card p-6 flex items-center justify-between gap-4 mb-12 max-w-3xl"
              >
                <span>
                  <span className="block text-sm text-muted-foreground mb-1">دليل ذو صلة</span>
                  <span className="font-bold text-foreground">{guide.title}</span>
                </span>
                <ArrowLeft size={18} className="text-primary flex-shrink-0" />
              </a>
            )}

            {related.length > 0 && category && (
              <>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">منتجات مشابهة</h2>
                  <a href={categoryPath(category)} className="text-primary font-semibold hover:underline">
                    كل منتجات {category.name}
                  </a>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {related.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
