import type { Metadata } from "next"
import UsersManager from "@/components/quotations/UsersManager"
import { listUsers } from "@/lib/users/store"

export const metadata: Metadata = { title: "المستخدمون", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function UsersPage() {
  return <UsersManager initialUsers={await listUsers()} />
}
