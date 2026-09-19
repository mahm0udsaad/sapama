import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { customerSchema } from "@/lib/quotations/schema"
import { createCustomer, listCustomers } from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function GET() {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  return NextResponse.json({ customers: await listCustomers() })
}

export async function POST(request: Request) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const parsed = customerSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "تحقق من بيانات العميل" }, { status: 400 })
  }
  const customer = await createCustomer(parsed.data, actor)
  return NextResponse.json({ customer }, { status: 201 })
}

