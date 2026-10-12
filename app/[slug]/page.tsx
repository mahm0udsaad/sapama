import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import {
  breadcrumbSchema,
  companyName,
  contactInfo,
  faqSchema,
  getSiteUrl,
  ogImage,
  organizationId,
  servicePages,
  storeUrl,
} from "@/lib/seo"

export const dynamicParams = false

type PageProps = { params: Promise<{ slug: string }> }

function findPage(slug: string) {
  return servicePages.find((page) => page.slug === slug)
}

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = findPage((await params).slug)
  if (!page) return {}

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: `/${page.slug}`,
      siteName: companyName,
      title: `${page.metaTitle} | ${companyName}`,
      description: page.metaDescription,
      images: [{ url: page.image, alt: page.imageAlt }, ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.metaTitle} | ${companyName}`,
      description: page.metaDescription,
      images: [page.image],
    },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const page = findPage((await params).slug)
  if (!page) notFound()

  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/${page.slug}`
  const relatedPages = servicePages.filter((item) => item.slug !== page.slug)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.metaTitle,
        description: page.metaDescription,
        inLanguage: "ar-SA",
        primaryImageOfPage: `${siteUrl}${page.image}`,
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "Service",
        name: page.title,
        description: page.metaDescription,
        url: pageUrl,
        image: `${siteUrl}${page.image}`,
        provider: { "@id": organizationId(siteUrl) },
        areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: page.title,
          url: storeUrl,
          itemListElement: page.sections.map((section) => ({
            "@type": "OfferCatalog",
            name: section.heading,
            itemListElement: (section.items ?? []).map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: item },
            })),
          })),
        },
      },
      breadcrumbSchema(siteUrl, [{ name: page.title, path: `/${page.slug}` }]),
      faqSchema(page.faqs),
    ],
  }

  return (
    <div className="w-full bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />

      <main>
        <section className="bg-gradient-to-b from-secondary/50 to-background pt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="مسار التنقل" className="text-sm text-muted-foreground mb-8">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <a href="/" className="hover:text-primary transition">
                    الرئيسية
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground font-medium">
                  {page.title}
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                  {page.title}
                  <span className="block text-primary text-2xl md:text-3xl mt-3">في السعودية من {companyName}</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{page.intro}</p>
                <div className="flex gap-4 flex-wrap">
                  <a href={storeUrl} className="btn-primary inline-flex items-center gap-2 group">
                    تسوق {page.title} من المتجر
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
                  </a>
                  <a href="/#contact" className="btn-secondary">
                    اطلب عرض سعر
                  </a>
                </div>
              </div>
              <div className="relative h-72 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60">
                <Image
                  src={page.image}
                  alt={page.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {page.sections.map((section) => (
              <article key={section.heading} className="rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{section.body}</p>
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              أسئلة شائعة عن {page.title}
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-foreground group-open:text-primary">
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-primary text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">جاهز للطلب؟</h2>
                <p className="text-white/90">
                  تصفح المنتجات في متجر {companyName} أو تواصل معنا على{" "}
                  <a href={`tel:${contactInfo.phoneIntl}`} dir="ltr" className="font-bold underline">
                    {contactInfo.phoneDisplay}
                  </a>
                </p>
              </div>
              <a href={storeUrl} className="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:shadow-lg transition">
                زيارة المتجر
              </a>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-16 mb-6">خدمات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPages.map((item) => (
                <a
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="service-card p-6 flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-foreground">{item.title}</span>
                  <ArrowLeft size={18} className="text-primary flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
