import type { Metadata } from "next"
import Script from "next/script"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { breadcrumbSchema, companyName, getSiteUrl, ogImage } from "@/lib/seo"

const title = "المدونة"
const description =
  "مقالات ونصائح من مدماك فيجن حول تجهيز مراكز العلاج الطبيعي والرعاية النهارية وأجهزة التأهيل في السعودية."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "/blog",
    siteName: companyName,
    title: `${title} | ${companyName}`,
    description,
    images: [ogImage],
  },
}

export default function BlogPage() {
  const siteUrl = getSiteUrl()
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbSchema(siteUrl, [{ name: title, path: "/blog" }])],
  }

  return (
    <div id="top" className="site-theme w-full bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />

      <main>
        <section className="bg-gradient-to-b from-secondary/50 to-background pt-10 pb-10">
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
                  {title}
                </li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">مدونة {companyName}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Soro blog embed: the script fills #soro-blog with the posts. */}
            <div className="rounded-3xl bg-[#092e50] p-4 md:p-8">
              <div id="soro-blog" />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Script
        src="https://app.trysoro.com/api/embed/2bfa1cf2-c6b2-4159-8a3b-c0d0de1f71c1?theme=dark"
        strategy="afterInteractive"
      />
    </div>
  )
}
