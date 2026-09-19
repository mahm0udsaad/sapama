import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { customerContactSchema } from "@/lib/quotations/schema"
import { createCustomerContact } from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const parsed = customerContactSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "أدخل اسم المسؤول ورقم الهاتف" }, { status: 400 })
  }
  const { id } = await context.params
  const contact = await createCustomerContact(id, parsed.data.name, parsed.data.phone, actor)
  if (!contact) return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 })
  return NextResponse.json({ contact }, { status: 201 })
}

