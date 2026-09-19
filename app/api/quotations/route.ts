import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { generateQuotationPdf } from "@/lib/quotations/generate-pdf"
import { upsertProductsFromQuotation } from "@/lib/quotations/products-store"
import { quotationInputSchema } from "@/lib/quotations/schema"
import {
  failQuotation,
  finalizeQuotation,
  getNextQuotationNumber,
  getQuotation,
  listQuotations,
  reserveQuotation,
} from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const query = new URL(request.url).searchParams.get("q") ?? ""
  const [quotations, nextQuotationNumber] = await Promise.all([listQuotations(query), getNextQuotationNumber()])
  return NextResponse.json({ quotations, nextQuotationNumber })
}

export async function POST(request: Request) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  let rawPayload: unknown
  try {
    rawPayload = await request.json()
  } catch {
    return NextResponse.json({ error: "تعذر قراءة بيانات عرض السعر" }, { status: 400 })
  }

  const parsed = quotationInputSchema.safeParse(rawPayload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "تحقق من جميع الحقول المطلوبة", issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const reservation = await reserveQuotation(parsed.data, actor)
  try {
    const quotation = await getQuotation(reservation.id)
    if (!quotation) throw new Error("تعذر استعادة عرض السعر بعد حجز الرقم")
    const generated = await generateQuotationPdf(quotation)
    await finalizeQuotation(reservation.id, generated.pdfPath, generated.sha256, actor)
    await upsertProductsFromQuotation(quotation.items, actor)
    return NextResponse.json(
      {
        id: reservation.id,
        quotationNumber: reservation.quotationNumber,
        pdfUrl: `/api/quotations/${reservation.id}/pdf`,
        sha256: generated.sha256,
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل إنشاء ملف PDF"
    await failQuotation(reservation.id, actor, message)
    return NextResponse.json(
      { error: `${message} تم حفظ محاولة الإصدار في سجل التدقيق.` },
      { status: 500 },
    )
  }
}

