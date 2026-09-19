import { readFile } from "node:fs/promises"
import { NextResponse } from "next/server"
import { getAdminUsername } from "@/lib/admin-auth"
import { getQuotationPdf } from "@/lib/quotations/store"

export const runtime = "nodejs"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await getAdminUsername()
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const { id } = await context.params
  const record = await getQuotationPdf(id)
  if (!record?.pdf_path || (record.status !== "issued" && record.status !== "cancelled")) {
    return NextResponse.json({ error: "ملف عرض السعر غير موجود" }, { status: 404 })
  }

  try {
    const pdf = await readFile(record.pdf_path)
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="quotation-${record.quotation_number}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "تعذر قراءة ملف عرض السعر" }, { status: 500 })
  }
}

