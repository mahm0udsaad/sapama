import { NextResponse } from "next/server"
import { getCatalogProductBySlug, getProductImageDataUrl } from "@/lib/products/catalog"

export const runtime = "nodejs"
export const revalidate = 3600

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const product = await getCatalogProductBySlug(slug)
  if (!product) return new NextResponse("Not found", { status: 404 })

  const dataUrl = await getProductImageDataUrl(product.id)
  const match = dataUrl?.match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/i)
  if (!match) return NextResponse.redirect(new URL("/logo.png", request.url), 307)

  return new NextResponse(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1].toLowerCase(),
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
