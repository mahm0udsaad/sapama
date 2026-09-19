import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/admin-auth"
import { createUserSchema } from "@/lib/quotations/schema"
import { createUser, listUsers } from "@/lib/users/store"

export const runtime = "nodejs"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ error: "هذه الصفحة للمدير فقط" }, { status: 403 })
  return NextResponse.json({ users: await listUsers() })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ error: "هذه الصفحة للمدير فقط" }, { status: 403 })

  const parsed = createUserSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "تحقق من بيانات المستخدم الجديد" }, { status: 400 })
  }

  try {
    const created = await createUser(parsed.data)
    return NextResponse.json({ user: created }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر إنشاء المستخدم"
    return NextResponse.json({ error: message }, { status: 409 })
  }
}
