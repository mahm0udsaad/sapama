import { NextResponse } from "next/server"
import {
  ADMIN_COOKIE,
  createAdminSession,
  validAdminCredentials,
} from "@/lib/admin-auth"

export async function POST(request: Request) {
  let credentials: { username?: string; password?: string }
  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ error: "بيانات الدخول غير صالحة" }, { status: 400 })
  }

  if (!(await validAdminCredentials(credentials.username ?? "", credentials.password ?? ""))) {
    return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 })
  }

  try {
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, createAdminSession(credentials.username!), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    })
    return response
  } catch {
    return NextResponse.json({ error: "لم يتم إعداد مفتاح جلسة الإدارة" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return response
}

