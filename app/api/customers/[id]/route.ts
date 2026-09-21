import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { customerSchema } from "@/lib/quotations/schema"
import { updateCustomer } from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const parsed = customerSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "تحقق من بيانات العميل" }, { status: 400 })
  const { id } = await context.params
  const customer = await updateCustomer(id, parsed.data)
  if (!customer) return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 })
  return NextResponse.json({ customer })
}
