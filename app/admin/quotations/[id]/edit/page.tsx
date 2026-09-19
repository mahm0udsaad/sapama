import type { Metadata } from "next"
import { notFound } from "next/navigation"
import QuotationBuilder from "@/components/quotations/QuotationBuilder"
import { getQuotation, listCustomers } from "@/lib/quotations/store"

export const metadata: Metadata = { title: "تعديل عرض سعر", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [quotation, customers] = await Promise.all([getQuotation(id), listCustomers()])
  if (!quotation || quotation.status !== "issued") notFound()
  return <QuotationBuilder nextQuotationNumber={quotation.quotationNumber} initialCustomers={customers} existing={quotation} />
}
