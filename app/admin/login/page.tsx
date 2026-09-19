import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminLoginForm from "@/components/quotations/AdminLoginForm"
import { getAdminUsername } from "@/lib/admin-auth"

export const metadata: Metadata = { title: "دخول الإدارة", robots: { index: false, follow: false } }

export default async function AdminLoginPage() {
  if (await getAdminUsername()) redirect("/admin/quotations")
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <AdminLoginForm />
    </main>
  )
}

