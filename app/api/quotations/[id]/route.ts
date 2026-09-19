import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { offerStatusSchema } from "@/lib/quotations/schema"
import { cancelQuotation, getQuotation, updateQuotationOfferStatus } from "@/lib/quotations/store"

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
    if (!(await updateQuotationOfferStatus(id, offerStatus.data, actor))) {
      return NextResponse.json({ error: "عرض السعر غير موجود" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  }
  if (payload?.action === "cancel") {
    if (!(await cancelQuotation(id, actor))) {
      return NextResponse.json({ error: "لا يمكن إلغاء هذا العرض" }, { status: 409 })
    }
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "الإجراء غير مدعوم" }, { status: 400 })
}
