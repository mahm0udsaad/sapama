import type { Metadata } from "next"
import ProductsGrid from "@/components/products/ProductsGrid"
import { listCatalogProducts } from "@/lib/products/catalog"
import { companyName, getSiteUrl } from "@/lib/seo"

export const revalidate = 3600

const siteUrl = getSiteUrl()
const title = "منتجاتنا | أجهزة ومعدات العلاج الطبيعي والتأهيل"
const description = `تصفح منتجات ${companyName}: أجهزة علاج طبيعي، ليزر، موجات تصادمية (شوكويف)، تنبيه كهربائي، موجات فوق صوتية، أجهزة شد فقرات، أسرّة وطاولات علاج، وأدوات إعادة تأهيل مع توريد وتركيب في جميع مناطق السعودية.`

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "أجهزة علاج طبيعي",
    "معدات العلاج الطبيعي",
    "أسعار أجهزة العلاج الطبيعي",
    "أجهزة BTL",
    "جهاز ليزر علاج طبيعي",
    "جهاز شوكويف",
    "جهاز تنبيه كهربائي",
    "جهاز موجات فوق صوتية",
    "جهاز شد فقرات",
    "أدوات إعادة تأهيل",
    "مستلزمات طبية السعودية",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: `${siteUrl}/products`,
    title,
    description,
    siteName: companyName,
    images: [{ url: "/logo.png", alt: `${companyName} - منتجات العلاج الطبيعي` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/logo.png"] },
}

export default async function ProductsPage() {
  const products = await listCatalogProducts()

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/products/${product.slug}`,
      name: product.name,
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "المنتجات", item: `${siteUrl}/products` },
    ],
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav aria-label="مسار التنقل" className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">الرئيسية</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">المنتجات</span>
      </nav>
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">أجهزة ومعدات العلاج الطبيعي والتأهيل</h1>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </header>
      <ProductsGrid products={products} />
    </main>
  )
}
