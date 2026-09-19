import type { Metadata } from "next"
import QuotationArchive from "@/components/quotations/QuotationArchive"
import { listQuotations } from "@/lib/quotations/store"

export const metadata: Metadata = { title: "أرشيف عروض الأسعار", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function QuotationsPage() {
  return <QuotationArchive initialQuotations={await listQuotations()} />
}

