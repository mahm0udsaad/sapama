import type { Metadata } from "next"
import QuotationBuilder from "@/components/quotations/QuotationBuilder"
import { getNextQuotationNumber, listCustomers } from "@/lib/quotations/store"

export const metadata: Metadata = { title: "إنشاء عرض سعر", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function NewQuotationPage() {
  const [nextQuotationNumber, initialCustomers] = await Promise.all([getNextQuotationNumber(), listCustomers()])
  return <QuotationBuilder nextQuotationNumber={nextQuotationNumber} initialCustomers={initialCustomers} />
}
