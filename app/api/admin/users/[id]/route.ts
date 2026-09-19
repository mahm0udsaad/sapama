import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/admin-auth"
import { setUserActive } from "@/lib/users/store"

export const runtime = "nodejs"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ error: "هذه الصفحة للمدير فقط" }, { status: 403 })

  const { id } = await context.params
  const payload = (await request.json().catch(() => null)) as { isActive?: boolean } | null
  if (typeof payload?.isActive !== "boolean") {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })
  }
  await setUserActive(id, payload.isActive)
  return NextResponse.json({ success: true })
}
