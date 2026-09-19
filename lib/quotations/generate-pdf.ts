import { access } from "node:fs/promises"
import { createHash } from "node:crypto"
import { chromium } from "playwright-core"
import { getSupabase } from "@/lib/supabase/server"
import { PDF_BUCKET } from "./store"
import { renderQuotationHtml } from "./pdf-template"
import type { StoredQuotation } from "./types"

const localCandidates = [
  process.env.CHROMIUM_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean) as string[]

async function launchBrowser() {
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    for (const candidate of localCandidates) {
      try {
        await access(candidate)
        return chromium.launch({ executablePath: candidate, headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
      } catch {
        // try next candidate
      }
    }
  }
  const serverless = (await import("@sparticuz/chromium")).default
  return chromium.launch({
    executablePath: await serverless.executablePath(),
    args: serverless.args,
    headless: true,
  })
}

export async function generateQuotationPdf(quotation: StoredQuotation) {
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage({ viewport: { width: 1224, height: 1584 } })
    await page.setContent(renderQuotationHtml(quotation), { waitUntil: "load" })
    await page.emulateMedia({ media: "print" })
    const buffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })
    const sha256 = createHash("sha256").update(buffer).digest("hex")
    const pdfPath = `quotation-${quotation.quotationNumber}-${quotation.id}.pdf`
    const { error } = await getSupabase().storage.from(PDF_BUCKET).upload(pdfPath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    })
    if (error) throw new Error(`تعذر حفظ ملف PDF: ${error.message}`)
    return { pdfPath, sha256, buffer }
  } finally {
    await browser.close()
  }
}
