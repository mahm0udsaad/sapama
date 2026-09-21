import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { updateProduct } from "@/lib/quotations/products-store"
import { productSchema } from "@/lib/quotations/schema"

export const runtime = "nodejs"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const parsed = productSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "تحقق من بيانات المنتج والصورة" }, { status: 400 })
  const { id } = await context.params
  try {
    const product = await updateProduct(id, parsed.data)
    if (!product) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحديث المنتج"
    return NextResponse.json({ error: message.includes("duplicate") ? "يوجد منتج بنفس الوصف" : message }, { status: 409 })
  }
}
