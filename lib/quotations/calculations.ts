import type { QuotationInput, QuotationItem } from "./types"

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function itemDiscountAmount(item: QuotationItem) {
  const subtotal = roundMoney(item.quantity * item.unitPrice)
  if (!item.discountType || !item.discountValue) return 0
  const raw = item.discountType === "percentage" ? subtotal * (item.discountValue / 100) : item.discountValue
  return roundMoney(Math.min(Math.max(raw, 0), subtotal))
}

export function itemTotals(item: QuotationItem) {
  const subtotal = roundMoney(item.quantity * item.unitPrice)
  const discount = itemDiscountAmount(item)
  const discounted = roundMoney(subtotal - discount)
  const vat = roundMoney(discounted * (item.vatRate / 100))
  return { subtotal, discount, discounted, vat, total: roundMoney(discounted + vat) }
}

export function quotationTotals(quotation: Pick<QuotationInput, "items">) {
  return quotation.items.reduce(
    (result, item) => {
      const totals = itemTotals(item)
      result.subtotal = roundMoney(result.subtotal + totals.subtotal)
      result.vat = roundMoney(result.vat + totals.vat)
      result.total = roundMoney(result.total + totals.total)
      return result
    },
    { subtotal: 0, vat: 0, total: 0 },
  )
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const ONES = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
  "عشرة",
  "أحد عشر",
  "اثنا عشر",
  "ثلاثة عشر",
  "أربعة عشر",
  "خمسة عشر",
  "ستة عشر",
  "سبعة عشر",
  "ثمانية عشر",
  "تسعة عشر",
]

const TENS = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"]
const HUNDREDS = ["", "مئة", "مئتان", "ثلاثمئة", "أربعمئة", "خمسمئة", "ستمئة", "سبعمئة", "ثمانمئة", "تسعمئة"]

function joinArabic(parts: string[]) {
  return parts.filter(Boolean).join(" و")
}

function underThousand(value: number): string {
  const hundreds = Math.floor(value / 100)
  const remainder = value % 100
  const parts = [HUNDREDS[hundreds]]

  if (remainder < 20) {
    parts.push(ONES[remainder])
  } else {
    const ones = remainder % 10
    const tens = Math.floor(remainder / 10)
    parts.push(joinArabic([ONES[ones], TENS[tens]]))
  }

  return joinArabic(parts)
}

function scaleWords(value: number, singular: string, dual: string, plural: string) {
  if (value === 1) return singular
  if (value === 2) return dual
  const number = underThousand(value)
  if (value >= 3 && value <= 10) return `${number} ${plural}`
  return `${number} ${singular}`
}

export function amountInArabicWords(amount: number) {
  const rounded = roundMoney(amount)
  const riyals = Math.floor(rounded)
  const halalas = Math.round((rounded - riyals) * 100)

  if (riyals === 0 && halalas === 0) return "صفر ريال فقط لا غير"

  const millions = Math.floor(riyals / 1_000_000)
  const thousands = Math.floor((riyals % 1_000_000) / 1_000)
  const rest = riyals % 1_000
  const groups: string[] = []

  if (millions) groups.push(scaleWords(millions, "مليون", "مليونان", "ملايين"))
  if (thousands) groups.push(scaleWords(thousands, "ألف", "ألفان", "آلاف"))
  if (rest) groups.push(underThousand(rest))

  let words = `${joinArabic(groups)} ريال`
  if (halalas) words += ` و${underThousand(halalas)} هللة`
  return `${words} فقط لا غير`
}
