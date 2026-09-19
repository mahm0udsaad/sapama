import { access, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
import { chromium } from "playwright-core"
import { pdfDirectory } from "./store"
import { renderQuotationHtml } from "./pdf-template"
import type { StoredQuotation } from "./types"

const executableCandidates = [
  process.env.CHROMIUM_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean) as string[]

async function findBrowserExecutable() {
  for (const candidate of executableCandidates) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Continue to the next known executable.
    }
  }
  throw new Error("لم يتم العثور على متصفح Chromium. اضبط CHROMIUM_EXECUTABLE_PATH.")
}

export async function generateQuotationPdf(quotation: StoredQuotation) {
  const executablePath = await findBrowserExecutable()
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

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
    await mkdir(pdfDirectory, { recursive: true })
    const pdfPath = path.join(pdfDirectory, `quotation-${quotation.quotationNumber}-${quotation.id}.pdf`)
    await writeFile(pdfPath, buffer)
    return { pdfPath, sha256, buffer }
  } finally {
    await browser.close()
  }
}

