import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/catalog/Breadcrumbs"
import ProductCard from "@/components/catalog/ProductCard"
import { breadcrumbSchema, companyName, getSiteUrl, servicePageForCategory } from "@/lib/seo"
import {
  categoryPath,
  childCategories,
  findCategoryBySlug,
  parentCategory,
  storeCategoryList,
} from "@/lib/store-categories"
import { getCategoryProducts, productImage, productPath } from "@/lib/store-catalog"

// Keep in step with catalogRevalidateSeconds in lib/store-catalog.ts.
export const revalidate = 21600
export const dynamicParams = false

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return storeCategoryList.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = findCategoryBySlug((await params).slug)
  if (!category) return {}

  const image = (await getCategoryProducts(category)).map((product) => productImage(product, 1200)).find(Boolean)

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: categoryPath(category) },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: categoryPath(category),
      siteName: companyName,
      title: `${category.metaTitle} | ${companyName}`,
      description: category.metaDescription,
      images: image ? [{ url: image, alt: category.name }] : undefined,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = findCategoryBySlug((await params).slug)
  if (!category) notFound()

  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}${categoryPath(category)}`
  const products = await getCategoryProducts(category)
  const parent = parentCategory(category)
  const children = childCategories(category)
  const guide = servicePageForCategory(category)

  const crumbs = [
    { name: "المنتجات", path: "/products" },
    ...(parent ? [{ name: parent.name, path: categoryPath(parent) }] : []),
    { name: category.name, path: categoryPath(category) },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: category.metaTitle,
        description: category.metaDescription,
        inLanguage: "ar-SA",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "ItemList",
        name: category.name,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${siteUrl}${productPath(product)}`,
        })),
      },
      breadcrumbSchema(siteUrl, crumbs),
    ],
  }

  return (
    <div className="w-full bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navigation />

      <main>
        <section className="bg-gradient-to-b from-secondary/50 to-background pt-10 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={crumbs} />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight max-w-4xl">
              {category.metaTitle}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">{category.metaDescription}</p>
            <p className="text-sm text-muted-foreground">{products.length} منتجًا</p>

            {children.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {children.map((child) => (
                  <a
                    key={child.slug}
                    href={categoryPath(child)}
                    className="bg-white border border-gray-200 rounded-full px-5 py-2 font-semibold text-foreground hover:border-primary hover:text-primary transition"
                  >
                    {child.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">منتجات {category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide && (
              <a href={`/${guide.slug}`} className="service-card p-6 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-sm text-muted-foreground mb-1">دليل التجهيز</span>
                  <span className="font-bold text-foreground">{guide.title}</span>
                </span>
                <ArrowLeft size={18} className="text-primary flex-shrink-0" />
              </a>
            )}
            <a href="/#contact" className="service-card p-6 flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm text-muted-foreground mb-1">للمراكز والعيادات</span>
                <span className="font-bold text-foreground">اطلب عرض سعر لمنتجات {category.name}</span>
              </span>
              <ArrowLeft size={18} className="text-primary flex-shrink-0" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
