import { amountInArabicWords, formatMoney, itemTotals, quotationTotals } from "@/lib/quotations/calculations"
import { COMPANY, QUOTATION_DEFAULTS } from "@/lib/quotations/constants"
import type { QuotationInput, QuotationItem } from "@/lib/quotations/types"

function formatDiscount(item: QuotationItem) {
  if (!item.discountType || !item.discountValue) return "--"
  return item.discountType === "percentage" ? `${formatMoney(item.discountValue)}%` : `${formatMoney(item.discountValue)} ر.س`
}

export default function QuotationPreview({ quotation, quotationNumber }: { quotation: QuotationInput; quotationNumber: number }) {
  const totals = quotationTotals(quotation)
  const date = new Intl.DateTimeFormat("en-GB").format(new Date())

  return (
    <div className="quotation-preview" aria-label="معاينة عرض السعر">
      <header className="quotation-preview-header">
        <div className="quotation-preview-seller">
          <p>{COMPANY.name}</p>
          <p>السجل التجاري: {COMPANY.commercialRegistration}</p>
          <p>الرقم الضريبي: {COMPANY.taxNumber}</p>
          <p>العنوان: {COMPANY.address}</p>
        </div>
        <div className="quotation-preview-logo"><img src="/logo.png" alt="مدماك فيجن" /></div>
      </header>
      <h2>[ عرض سعر ]</h2>
      <section className="quotation-preview-meta">
        <div>
          <p>التاريخ: {date}</p>
          <p>رقم عرض السعر: {quotationNumber}</p>
          <p>رقم التواصل: {COMPANY.phone}</p>
        </div>
        <div>
          <p>اسم العميل: {quotation.customerName || "—"}</p>
          <p>اسم المسؤول: {quotation.contactName || "—"}</p>
          <p>رقم الهاتف: {quotation.phone || "—"}</p>
          <p>العنوان: {quotation.address || "—"}</p>
          {quotation.customerCommercialRegistration ? <p>السجل التجاري: {quotation.customerCommercialRegistration}</p> : null}
          {quotation.customerTaxNumber ? <p>الرقم الضريبي: {quotation.customerTaxNumber}</p> : null}
        </div>
      </section>
      <table>
        <thead><tr><th>م</th><th>البند</th><th>الكمية</th><th>الإفرادي</th><th>الخصم</th><th>الضريبة</th><th>الإجمالي</th><th>صور المنتجات</th></tr></thead>
        <tbody>
          {quotation.items.map((item, index) => {
            const result = itemTotals(item)
            return (
              <tr key={item.id}>
                <td className="preview-number">{index + 1}</td>
                <td className="preview-description"><strong>{item.description || "وصف المنتج"}</strong><span>{item.origin}</span></td>
                <td>{formatMoney(item.quantity)}</td>
                <td>{formatMoney(item.unitPrice)}</td>
                <td>{formatDiscount(item)}</td>
                <td>{item.vatRate ? `${item.vatRate}%` : "--"}</td>
                <td>{formatMoney(result.total)}</td>
                <td>{item.imageDataUrl ? <img src={item.imageDataUrl} alt="صورة المنتج" /> : <span className="preview-empty-image">بدون صورة</span>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <section className="quotation-preview-summary">
        <div><p>إجمالي الضريبة: <b>{totals.vat ? formatMoney(totals.vat) : "----"}</b></p><p>الإجمالي: <b>{formatMoney(totals.total)}</b></p></div>
        <div><p>الإجمالي شامل الضريبة: <b>{formatMoney(totals.total)}</b></p><p>{amountInArabicWords(totals.total)}</p></div>
      </section>
      <section className="quotation-preview-details">
        <div>
          <p>البيانات البنكية للتحويل:</p><p>اسم الحساب: {COMPANY.accountName}</p><p>رقم الحساب: {COMPANY.accountNumber}</p><p>رقم الآيبان: {COMPANY.iban}</p><p>اسم البنك: {COMPANY.bankName}</p>
        </div>
        <div>
          <p>مدة عرض السعر: {QUOTATION_DEFAULTS.validityDays} يوم</p><p>مدة التوريد بعد التعميد: {QUOTATION_DEFAULTS.deliveryDays} أيام</p><p>طريقة الدفع: {QUOTATION_DEFAULTS.paymentTerms}</p><p>الضمان: <span>{QUOTATION_DEFAULTS.warranty}</span></p>
        </div>
      </section>
      <p className="quotation-preview-sales">مسؤول المبيعات: {COMPANY.salesRepresentative}</p>
    </div>
  )
}

