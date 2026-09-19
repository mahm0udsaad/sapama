"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FilePlus2, Files, LogOut, Users } from "lucide-react"
import type { UserRole } from "@/lib/quotations/types"

export default function AdminHeader({ username, role }: { username: string; role?: UserRole }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" })
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex min-h-20 max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="مدماك فيجن" className="h-11 w-auto" />
          <div className="hidden border-r border-border pr-4 sm:block">
            <p className="font-bold">نظام عروض الأسعار</p>
            <p className="text-xs text-muted-foreground">مرحباً، {username}</p>
          </div>
        </div>
        <nav aria-label="التنقل الإداري" className="flex items-center gap-2">
          <Link href="/admin/quotations" className={pathname === "/admin/quotations" ? "admin-nav-link-active" : "admin-nav-link"}>
            <Files aria-hidden="true" /> الأرشيف
          </Link>
          <Link href="/admin/quotations/new" className={pathname.endsWith("/new") ? "admin-nav-link-active" : "admin-nav-link"}>
            <FilePlus2 aria-hidden="true" /> عرض جديد
          </Link>
          {role === "admin" ? (
            <Link href="/admin/users" className={pathname.startsWith("/admin/users") ? "admin-nav-link-active" : "admin-nav-link"}>
              <Users aria-hidden="true" /> المستخدمون
            </Link>
          ) : null}
          <button onClick={logout} className="admin-icon-button" aria-label="تسجيل الخروج" title="تسجيل الخروج">
            <LogOut aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  )
}

