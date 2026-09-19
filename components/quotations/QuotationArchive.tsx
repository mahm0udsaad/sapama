"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Ban, Download, FilePlus2, Search } from "lucide-react"
import { formatMoney } from "@/lib/quotations/calculations"
import { OFFER_STATUS_LABELS } from "@/lib/quotations/types"
import type { OfferStatus, QuotationSummary } from "@/lib/quotations/types"

const STATUS_LABELS = { issued: "صادر", cancelled: "ملغي", failed: "فشل الإصدار", processing: "قيد الإصدار" }

export default function QuotationArchive({ initialQuotations }: { initialQuotations: QuotationSummary[] }) {
  const [quotations, setQuotations] = useState(initialQuotations)
  const [query, setQuery] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const normalized = query.trim()
    if (!normalized) return quotations
    return quotations.filter((quote) =>
      `${quote.quotationNumber} ${quote.customerName} ${OFFER_STATUS_LABELS[quote.offerStatus]}`.includes(normalized),
    )
  }, [query, quotations])

  async function cancel(id: string) {
    if (!window.confirm("سيبقى الملف محفوظاً في الأرشيف، لكن ستتغير حالته إلى ملغي. متابعة؟")) return
    setBusyId(id)
    const response = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    })
    setBusyId(null)
    if (response.ok) {
      setQuotations((current) => current.map((quote) => quote.id === id ? { ...quote, status: "cancelled" } : quote))
    }
  }

  async function updateOfferStatus(id: string, offerStatus: OfferStatus) {
    setBusyId(id)
    const response = await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_offer_status", offerStatus }),
    })
    setBusyId(null)
    if (response.ok) {
      setQuotations((current) => current.map((quote) => quote.id === id ? { ...quote, offerStatus } : quote))
    }
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-1 text-sm font-bold text-primary">السجل الدائم</p>
          <h1 className="text-3xl font-bold">أرشيف عروض الأسعار</h1>
          <p className="mt-2 text-muted-foreground">كل ملف صادر محفوظ مع بصمته الرقمية وحالة العرض.</p>
        </div>
        <Link href="/admin/quotations/new" className="admin-primary-button">
          <FilePlus2 aria-hidden="true" /> إنشاء عرض سعر
        </Link>
      </div>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-border p-4">
          <label className="relative block max-w-md">
            <span className="sr-only">البحث في الأرشيف</span>
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالرقم أو اسم العميل" className="admin-input pr-10" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-right text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">رقم العرض</th>
                <th className="px-5 py-3 font-semibold">العميل</th>
                <th className="px-5 py-3 font-semibold">التاريخ</th>
                <th className="px-5 py-3 font-semibold">الإجمالي</th>
                <th className="px-5 py-3 font-semibold">حالة العرض</th>
                <th className="px-5 py-3 font-semibold">حالة الملف</th>
                <th className="px-5 py-3 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((quote) => (
                <tr key={quote.id} className="bg-card">
                  <td className="px-5 py-4 font-bold tabular-nums">{quote.quotationNumber}</td>
                  <td className="px-5 py-4 font-semibold">{quote.customerName}</td>
                  <td className="px-5 py-4 text-muted-foreground">{quote.issueDate}</td>
                  <td className="px-5 py-4 font-bold tabular-nums">{formatMoney(quote.total)} ر.س</td>
                  <td className="px-5 py-4">
                    <select
                      aria-label={`حالة عرض السعر ${quote.quotationNumber}`}
                      value={quote.offerStatus}
                      disabled={busyId === quote.id || quote.status === "failed"}
                      onChange={(event) => updateOfferStatus(quote.id, event.target.value as OfferStatus)}
                      className="admin-input min-h-9 min-w-32 py-1"
                    >
                      {Object.entries(OFFER_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4"><span className={`status-${quote.status}`}>{STATUS_LABELS[quote.status]}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {quote.pdfSha256 ? (
                        <a href={`/api/quotations/${quote.id}/pdf`} target="_blank" rel="noreferrer" className="admin-secondary-button">
                          <Download aria-hidden="true" /> PDF
                        </a>
                      ) : null}
                      {quote.status === "issued" ? (
                        <button disabled={busyId === quote.id} onClick={() => cancel(quote.id)} className="admin-danger-button">
                          <Ban aria-hidden="true" /> إلغاء
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!visible.length ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">لا توجد عروض مطابقة.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
