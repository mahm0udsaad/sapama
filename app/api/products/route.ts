import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { listProducts } from "@/lib/quotations/products-store"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const query = new URL(request.url).searchParams.get("q") ?? ""
  return NextResponse.json({ products: await listProducts(query) })
}
