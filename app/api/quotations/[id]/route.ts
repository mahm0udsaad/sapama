import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { generateQuotationPdf } from "@/lib/quotations/generate-pdf"
import { upsertProductsFromQuotation } from "@/lib/quotations/products-store"
import { offerStatusSchema, quotationInputSchema } from "@/lib/quotations/schema"
import { cancelQuotation, getQuotation, replaceQuotationPdf, updateQuotationContent, updateQuotationOfferStatus } from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const { id } = await context.params
  const quotation = await getQuotation(id)
  if (!quotation) return NextResponse.json({ error: "عرض السعر غير موجود" }, { status: 404 })
  return NextResponse.json({ quotation })
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const { id } = await context.params
  const payload = (await request.json().catch(() => null)) as { action?: string } | null
  if (payload?.action === "update_offer_status") {
    const offerStatus = offerStatusSchema.safeParse((payload as { offerStatus?: unknown }).offerStatus)
    if (!offerStatus.success) return NextResponse.json({ error: "حالة العرض غير صالحة" }, { status: 400 })
    try {
      const persistedStatus = await updateQuotationOfferStatus(id, offerStatus.data, actor)
      if (!persistedStatus) return NextResponse.json({ error: "عرض السعر غير موجود" }, { status: 404 })
      return NextResponse.json({ success: true, offerStatus: persistedStatus })
    } catch (error) {
      const message = error instanceof Error ? error.message : "تعذر تحديث حالة العرض"
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
  if (payload?.action === "cancel") {
    if (!(await cancelQuotation(id, actor))) {
      return NextResponse.json({ error: "لا يمكن إلغاء هذا العرض" }, { status: 409 })
    }
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "الإجراء غير مدعوم" }, { status: 400 })
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const { id } = await context.params
  const parsed = quotationInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "تحقق من جميع الحقول المطلوبة" }, { status: 400 })
  try {
    if (!(await updateQuotationContent(id, parsed.data, actor))) {
      return NextResponse.json({ error: "لا يمكن تعديل هذا العرض" }, { status: 409 })
    }
    const quotation = await getQuotation(id)
    if (!quotation) throw new Error("عرض السعر غير موجود")
    const generated = await generateQuotationPdf(quotation)
    await replaceQuotationPdf(id, generated.sha256)
    await upsertProductsFromQuotation(quotation.items, actor)
    return NextResponse.json({ id, quotationNumber: quotation.quotationNumber, pdfUrl: `/api/quotations/${id}/pdf` })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحديث عرض السعر"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
