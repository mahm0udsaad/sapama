import { readFileSync } from "node:fs"
import path from "node:path"
import { amountInArabicWords, formatMoney, itemTotals, quotationTotals } from "./calculations"
import { COMPANY, QUOTATION_DEFAULTS } from "./constants"
import type { QuotationItem, StoredQuotation } from "./types"

function formatDiscount(item: QuotationItem) {
  if (!item.discountType || !item.discountValue) return "--"
  return item.discountType === "percentage" ? `${formatMoney(item.discountValue)}%` : `${formatMoney(item.discountValue)} ر.س`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function logoDataUrl() {
  const logo = readFileSync(path.join(process.cwd(), "public", "logo.png"))
  return `data:image/png;base64,${logo.toString("base64")}`
}

function displayDate(date: string) {
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

export function renderQuotationHtml(quotation: StoredQuotation) {
  const totals = quotationTotals(quotation)
  const rows = quotation.items
    .map((item, index) => {
      const result = itemTotals(item)
      const image = item.imageDataUrl
        ? `<img src="${item.imageDataUrl}" alt="صورة المنتج" />`
        : `<div class="image-placeholder">بدون صورة</div>`
      return `
        <tr>
          <td class="number">${index + 1}</td>
          <td class="description"><strong>${escapeHtml(item.description)}</strong>${item.origin ? `<span>${escapeHtml(item.origin)}</span>` : ""}</td>
          <td>${formatMoney(item.quantity)}</td>
          <td>${formatMoney(item.unitPrice)}</td>
          <td>${formatDiscount(item)}</td>
          <td>${item.vatRate === 0 ? "--" : `${item.vatRate}%`}</td>
          <td>${formatMoney(result.total)}</td>
          <td class="product-image">${image}</td>
        </tr>`
    })
    .join("")

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: Letter portrait; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; color: #111827; font-family: Arial, Tahoma, sans-serif; }
    body { background: white; direction: rtl; }
    .page { width: 8.5in; min-height: 11in; padding: .23in .28in .22in; display: flex; flex-direction: column; gap: 13px; }
    .header { display: grid; grid-template-columns: 1fr 1.08fr; min-height: 132px; border-top: 1px solid #2f6edb; }
    .seller { border: 1px solid #2f6edb; border-top: 0; border-left: 0; padding: 8px 13px; font-size: 13px; line-height: 1.85; font-weight: 700; color: #42526b; }
    .seller p { margin: 0; }
    .logo-wrap { display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #2f6edb; }
    .logo-wrap img { width: 250px; height: auto; object-fit: contain; }
    .title { color: #0874bc; text-align: center; font-size: 25px; font-weight: 800; letter-spacing: .4px; margin: 1px 0 0; }
    .meta { border: 1px solid #111827; display: grid; grid-template-columns: 1fr 1fr; font-size: 14px; font-weight: 700; line-height: 1.85; }
    .meta > div { padding: 4px 10px; }
    .meta > div + div { border-right: 1px solid #111827; }
    .meta p { margin: 0; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; }
    th, td { border: 1px solid #111827; padding: 5px 4px; text-align: center; vertical-align: top; }
    th { background: #dce9f7; font-size: 13px; height: 36px; vertical-align: middle; }
    tbody tr { height: 108px; }
    .number { color: #c91515; font-weight: 800; width: 3%; }
    .description { width: 35%; text-align: right; font-size: 12px; line-height: 1.65; }
    .description span { display: block; text-align: center; margin-top: 5px; font-weight: 700; }
    .product-image { width: 27%; padding: 5px; vertical-align: middle; }
    .product-image img { width: 100%; height: 98px; object-fit: contain; }
    .image-placeholder { color: #64748b; font-size: 11px; }
    .summary { border: 1px solid #111827; display: grid; grid-template-columns: 1fr 1fr; font-size: 13px; font-weight: 700; line-height: 1.7; }
    .summary > div { padding: 5px 10px; }
    .summary > div + div { border-right: 1px solid #111827; }
    .summary p { margin: 0; }
    .amount-words { font-size: 14px; text-align: center; margin-top: 4px !important; }
    .red { color: #d31313; }
    .details { border: 1px solid #111827; display: grid; grid-template-columns: 1fr 1fr; font-size: 12.5px; font-weight: 700; line-height: 1.7; }
    .details > div { padding: 4px 10px; }
    .details > div + div { border-right: 1px solid #111827; }
    .details p { margin: 0; }
    .warranty { color: #d31313; }
    .sales { font-size: 15px; text-align: center; margin-top: -8px; }
    .audit { margin-top: auto; border-top: 1px solid #dbe3ef; padding-top: 5px; font-size: 7px; color: #64748b; direction: ltr; text-align: left; }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <section class="seller">
        <p>${COMPANY.name}</p>
        <p>السجل التجاري: ${COMPANY.commercialRegistration}</p>
        <p>الرقم الضريبي: ${COMPANY.taxNumber}</p>
        <p>العنوان: ${COMPANY.address}</p>
      </section>
      <div class="logo-wrap"><img src="${logoDataUrl()}" alt="مدماك فيجن" /></div>
    </header>

    <h1 class="title">[ عرض سعر ]</h1>

    <section class="meta">
      <div>
        <p>التاريخ: ${displayDate(quotation.issueDate)}</p>
        <p>رقم عرض السعر: ${quotation.quotationNumber}</p>
        <p>رقم التواصل: ${COMPANY.phone}</p>
      </div>
      <div>
        <p>اسم العميل: ${escapeHtml(quotation.customerName)}</p>
        <p>اسم المسؤول: ${escapeHtml(quotation.contactName)}</p>
        <p>رقم الهاتف: ${escapeHtml(quotation.phone)}</p>
        <p>العنوان: ${escapeHtml(quotation.address)}</p>
        ${quotation.customerCommercialRegistration ? `<p>السجل التجاري: ${escapeHtml(quotation.customerCommercialRegistration)}</p>` : ""}
        ${quotation.customerTaxNumber ? `<p>الرقم الضريبي: ${escapeHtml(quotation.customerTaxNumber)}</p>` : ""}
      </div>
    </section>

    <table>
      <thead>
        <tr>
          <th style="width:3%">م</th>
          <th style="width:30%">البند</th>
          <th style="width:7%">الكمية</th>
          <th style="width:9%">الإفرادي</th>
          <th style="width:8%">الخصم</th>
          <th style="width:8%">الضريبة</th>
          <th style="width:8%">الإجمالي</th>
          <th style="width:27%">صور المنتجات</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <section class="summary">
      <div>
        <p>إجمالي الضريبة: <span class="red">${totals.vat ? formatMoney(totals.vat) : "----"}</span></p>
        <p>الإجمالي: <span class="red">${formatMoney(totals.total)}</span></p>
      </div>
      <div>
        <p>الإجمالي شامل الضريبة: <span class="red">${formatMoney(totals.total)}</span></p>
        <p class="amount-words">${amountInArabicWords(totals.total)}</p>
      </div>
    </section>

    <section class="details">
      <div>
        <p>البيانات البنكية للتحويل:</p>
        <p>اسم الحساب: ${COMPANY.accountName}</p>
        <p>رقم الحساب: ${COMPANY.accountNumber}</p>
        <p>رقم الآيبان: ${COMPANY.iban}</p>
        <p>اسم البنك: ${COMPANY.bankName}</p>
      </div>
      <div>
        <p>مدة عرض السعر: ${QUOTATION_DEFAULTS.validityDays} يوم</p>
        <p>مدة التوريد بعد التعميد: ${QUOTATION_DEFAULTS.deliveryDays} أيام</p>
        <p>طريقة الدفع: ${QUOTATION_DEFAULTS.paymentTerms}</p>
        <p>الضمان: <span class="warranty">${QUOTATION_DEFAULTS.warranty}</span></p>
      </div>
    </section>

    <p class="sales">مسؤول المبيعات: ${COMPANY.salesRepresentative}</p>
    <footer class="audit">ID: ${quotation.id} · SHA-256 محفوظ في سجل النظام · Template: ${quotation.templateVersion}</footer>
  </main>
</body>
</html>`
}

