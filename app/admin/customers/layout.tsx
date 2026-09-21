import { redirect } from "next/navigation"
import AdminHeader from "@/components/quotations/AdminHeader"
import { getCurrentUser } from "@/lib/admin-auth"

export default async function CustomersLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  return <div className="min-h-screen bg-muted/35"><AdminHeader username={user.displayName || user.username} role={user.role} />{children}</div>
}
