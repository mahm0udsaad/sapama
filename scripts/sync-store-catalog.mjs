// Refreshes lib/store-catalog.snapshot.json from the store.
// Run with: pnpm sync:store
import { writeFile } from "node:fs/promises"
import { fetchLiveProducts, fetchProductDescriptionHtml, htmlToBlocks } from "../lib/store-api.mjs"

// Keep in sync with the ids in lib/store-categories.ts.
const categoryIds = [
  "1112889071", "1704436730", "1269249283", "460588562", "770029847", "22667716", "755183558",
  "2129153735", "70669797", "1444115686", "132318674", "681365933", "1589097132", "639844008",
  "2054811822", "1879596457", "531864491",
]

const products = await fetchLiveProducts(categoryIds)
console.log(`Fetched ${products.length} products`)

let withBlocks = 0
for (const [index, product] of products.entries()) {
  try {
    const html = await fetchProductDescriptionHtml(product.id)
    product.blocks = htmlToBlocks(html, product.name)
    if (product.blocks.length) withBlocks += 1
  } catch (error) {
    console.warn(`No description for ${product.id}: ${error.message}`)
  }
  if ((index + 1) % 50 === 0) console.log(`  descriptions ${index + 1}/${products.length}`)
}

const snapshot = { fetchedAt: new Date().toISOString(), products }
await writeFile(new URL("../lib/store-catalog.snapshot.json", import.meta.url), `${JSON.stringify(snapshot, null, 1)}\n`)
console.log(`Wrote snapshot: ${products.length} products, ${withBlocks} with structured descriptions`)
