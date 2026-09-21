import type { Metadata } from "next"
import CustomersManager from "@/components/quotations/CustomersManager"
import { listCustomers } from "@/lib/quotations/store"

export const metadata: Metadata = { title: "العملاء", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  return <CustomersManager initialCustomers={await listCustomers()} />
}
