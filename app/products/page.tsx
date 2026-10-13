import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/catalog/Breadcrumbs"
import { breadcrumbSchema, companyName, getSiteUrl } from "@/lib/seo"
import { categoryPath, childCategories, storeCategoryList } from "@/lib/store-categories"
import { getCategoryProducts, getProducts, productImage } from "@/lib/store-catalog"

// Keep in step with catalogRevalidateSeconds in lib/store-catalog.ts.
export const revalidate = 21600

const title = "منتجات العلاج الطبيعي والرعاية النهارية"
const description =
  "جميع منتجات مدماك فيجن: أجهزة العلاج الكهربائي، طاولات العلاج، معدات التأهيل، العلاج المائي، أدوات التكامل الحسي والعلاج الوظيفي والتخاطب، مع رابط شراء مباشر من المتجر."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: { type: "website", locale: "ar_SA", url: "/products", siteName: companyName, title, description },
}

export default async function ProductsPage() {
  const siteUrl = getSiteUrl()
  const total = (await getProducts()).length
  const topLevel = storeCategoryList.filter((category) => !category.parent)
  const crumbs = [{ name: "المنتجات", path: "/products" }]

  const groups = await Promise.all(
    topLevel.map(async (category) => ({
      category,
      children: await Promise.all(
        childCategories(category).map(async (child) => {
          const products = await getCategoryProducts(child)
          return { category: child, count: products.length, image: products.map((p) => productImage(p, 400)).find(Boolean) }
        }),
      ),
    })),
  )

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/products#webpage`,
        url: `${siteUrl}/products`,
        name: title,
        description,
        inLanguage: "ar-SA",
        isPartOf: { "@id": `${siteUrl}/#website` },
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
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              منتجات {companyName}
              <span className="block text-primary text-2xl md:text-3xl mt-3">أجهزة العلاج الطبيعي ومستلزمات الرعاية النهارية</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {total} منتجًا. اختر القسم لتصفح المنتجات ومواصفاتها، ثم أكمل الشراء مباشرة من متجر{" "}
              {companyName}.
            </p>
          </div>
        </section>

        {groups.map(({ category, children }) => (
          <section key={category.slug} className="py-12 bg-white even:bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                <a href={categoryPath(category)} className="text-primary font-semibold hover:underline flex-shrink-0">
                  عرض الكل
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {children.map(({ category: child, count, image }) => (
                  <a key={child.slug} href={categoryPath(child)} className="service-card flex flex-col group">
                    <div className="aspect-[4/3] bg-white flex items-center justify-center p-4 border-b border-gray-100">
                      {image && (
                        <img
                          src={image}
                          alt={child.name}
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3">
                      <span>
                        <span className="block font-bold text-foreground">{child.name}</span>
                        <span className="text-sm text-muted-foreground">{count} منتجًا</span>
                      </span>
                      <ArrowLeft size={18} className="text-primary flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}
