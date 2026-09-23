"use client"

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Download, ImagePlus, ListPlus, Plus, Save, Trash2, UserPlus, X } from "lucide-react"
import QuotationPreview from "./QuotationPreview"
import ProductPickerModal from "./ProductPickerModal"
import { OFFER_STATUS_LABELS } from "@/lib/quotations/types"
import { QUOTATION_DEFAULTS } from "@/lib/quotations/constants"
import type { StoredQuotation, Customer, DiscountType, OfferStatus, Product, QuotationInput, QuotationItem, VatRate } from "@/lib/quotations/types"

const DRAFT_KEY = "madmak-quotation-draft-v3"
const CREATE_NEW = "__new__"
const MAX_IMAGE_DATA_URL_LENGTH = 260_000
const MAX_QUOTATION_REQUEST_BYTES = 4_000_000

function emptyItem(): QuotationItem {
  return { id: crypto.randomUUID(), description: "", origin: "", quantity: 1, unitPrice: 0, vatRate: 0, discountType: null, discountValue: 0 }
}

const EMPTY_QUOTATION: QuotationInput = {
  customerId: "", customerName: "", contactId: "", contactName: "", phone: "", address: "",
  offerStatus: "temporary", items: [],
  validityDays: QUOTATION_DEFAULTS.validityDays,
  deliveryDays: QUOTATION_DEFAULTS.deliveryDays,
  paymentTerms: QUOTATION_DEFAULTS.paymentTerms,
  warranty: QUOTATION_DEFAULTS.warranty,
}

const EMPTY_NEW_CUSTOMER = {
  name: "",
  address: "الرياض",
  district: "",
  street: "",
  postalCode: "",
  additionalNumber: "",
  buildingNumber: "",
  commercialRegistration: "",
  taxNumber: "",
}

async function requestJson<T>(url: string, options: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مرة أخرى.")
  }
  const responseText = await response.text()
  const result = responseText ? parseJson<T>(responseText) : ({} as T & { error?: string })
  if (!response.ok) {
    const serverError = typeof result === "object" && result && "error" in result ? String(result.error) : ""
    if (serverError) throw new Error(serverError)
    if (response.status === 413) throw new Error("حجم صور المنتجات كبير جداً. أعد اختيار الصور وسيتم ضغطها تلقائياً.")
    if (response.status === 401) throw new Error("انتهت جلسة الدخول. حدّث الصفحة وسجّل الدخول مرة أخرى.")
    if (response.status === 504) throw new Error("استغرق إنشاء ملف PDF وقتاً أطول من المسموح. حاول مرة أخرى.")
    throw new Error(`تعذر تنفيذ الطلب على الخادم (رمز ${response.status}).`)
  }
  return result
}

function parseJson<T>(value: string): T & { error?: string } {
  try {
    return JSON.parse(value) as T & { error?: string }
  } catch {
    return {} as T & { error?: string }
  }
}

async function optimizeImageDataUrl(dataUrl: string) {
  if (dataUrl.length <= MAX_IMAGE_DATA_URL_LENGTH) return dataUrl

  const image = new Image()
  image.decoding = "async"
  image.src = dataUrl
  await image.decode()

  let scale = Math.min(1, 1000 / image.naturalWidth, 1000 / image.naturalHeight)
  let optimized = dataUrl
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext("2d")
    if (!context) throw new Error("تعذر تجهيز صورة المنتج")
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    optimized = canvas.toDataURL("image/jpeg", Math.max(0.48, 0.82 - attempt * 0.1))
    if (optimized.length <= MAX_IMAGE_DATA_URL_LENGTH) return optimized
    scale *= 0.72
  }
  throw new Error("تعذر ضغط صورة المنتج إلى حجم مناسب. اختر صورة أصغر.")
}

export default function QuotationBuilder({ nextQuotationNumber, initialCustomers, existing }: { nextQuotationNumber: number; initialCustomers: Customer[]; existing?: StoredQuotation }) {
  const router = useRouter()
  const [customers, setCustomers] = useState(initialCustomers)
  const [quotation, setQuotation] = useState<QuotationInput>(() => existing
    ? {
        customerId: existing.customerId, customerName: existing.customerName, contactId: existing.contactId, contactName: existing.contactName, phone: existing.phone, address: existing.address, customerCommercialRegistration: existing.customerCommercialRegistration, customerTaxNumber: existing.customerTaxNumber, offerStatus: existing.offerStatus, items: existing.items,
        validityDays: existing.validityDays ?? QUOTATION_DEFAULTS.validityDays,
        deliveryDays: existing.deliveryDays ?? QUOTATION_DEFAULTS.deliveryDays,
        paymentTerms: existing.paymentTerms ?? QUOTATION_DEFAULTS.paymentTerms,
        warranty: existing.warranty ?? QUOTATION_DEFAULTS.warranty,
      }
    : { ...EMPTY_QUOTATION, items: [emptyItem()] })
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState(EMPTY_NEW_CUSTOMER)
  const [directoryBusy, setDirectoryBusy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)
  const [error, setError] = useState("")
  const [issued, setIssued] = useState<{ number: number; url: string } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const selectedCustomer = useMemo(() => customers.find((customer) => customer.id === quotation.customerId), [customers, quotation.customerId])

  useEffect(() => {
    if (existing) return
    const saved = localStorage.getItem(DRAFT_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as Partial<QuotationInput>
      if (parsed.items?.length) setQuotation({ ...EMPTY_QUOTATION, ...parsed, items: parsed.items })
    } catch { localStorage.removeItem(DRAFT_KEY) }
  }, [])

  useEffect(() => {
    if (existing) return
    const timeout = window.setTimeout(() => localStorage.setItem(DRAFT_KEY, JSON.stringify(quotation)), 400)
    return () => window.clearTimeout(timeout)
  }, [quotation, existing])

  function selectCustomer(value: string) {
    if (value === CREATE_NEW) { setShowNewCustomer(true); return }
    const customer = customers.find((entry) => entry.id === value)
    setShowNewCustomer(false)
    setQuotation((current) => ({
      ...current,
      customerId: customer?.id ?? "",
      customerName: customer?.name ?? "",
      address: composeAddress(customer),
      customerCommercialRegistration: customer?.commercialRegistration ?? "",
      customerTaxNumber: customer?.taxNumber ?? "",
    }))
  }

  async function createNewCustomer() {
    setError(""); setDirectoryBusy(true)
    try {
      const result = await requestJson<{ customer: Customer }>("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCustomer) })
      setCustomers((current) => [...current, result.customer].toSorted((a, b) => a.name.localeCompare(b.name, "ar")))
      setQuotation((current) => ({
        ...current,
        customerId: result.customer.id,
        customerName: result.customer.name,
        address: composeAddress(result.customer),
        customerCommercialRegistration: result.customer.commercialRegistration ?? "",
        customerTaxNumber: result.customer.taxNumber ?? "",
      }))
      setShowNewCustomer(false); setNewCustomer(EMPTY_NEW_CUSTOMER)
    } catch (creationError) { setError(creationError instanceof Error ? creationError.message : "تعذر إنشاء العميل") }
    finally { setDirectoryBusy(false) }
  }

  function updateItem(id: string, changes: Partial<QuotationItem>) {
    setQuotation((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, ...changes } : item) }))
  }

  function removeItem(id: string) { setQuotation((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) })) }

  function addProductFromCatalog(product: Product) {
    setQuotation((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: crypto.randomUUID(),
          description: product.description,
          origin: product.origin,
          quantity: 1,
          unitPrice: product.unitPrice,
          vatRate: product.vatRate,
          imageDataUrl: product.imageDataUrl ?? undefined,
          discountType: null,
          discountValue: 0,
          productId: product.id,
        },
      ],
    }))
  }

  async function uploadImage(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2_000_000) { setError("حجم صورة المنتج يجب ألا يتجاوز 2 ميجابايت."); return }
    setError("")
    setImageBusy(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("تعذر قراءة صورة المنتج"))
        reader.readAsDataURL(file)
      })
      updateItem(id, { imageDataUrl: await optimizeImageDataUrl(dataUrl) })
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "تعذر تجهيز صورة المنتج")
    } finally {
      setImageBusy(false)
      event.target.value = ""
    }
  }

  async function issueQuotation(event: FormEvent) {
    event.preventDefault(); setError("")
    if (!quotation.customerId || !quotation.contactName.trim() || !quotation.phone.trim()) { setError("اختر العميل وأدخل المسؤول ورقم هاتفه قبل إصدار عرض السعر."); return }
    if (!quotation.items.length) { setError("أضف منتجاً واحداً على الأقل."); return }
    setSubmitting(true)
    try {
      const normalizedQuotation = {
        ...quotation,
        items: await Promise.all(quotation.items.map(async (item) => ({
          ...item,
          imageDataUrl: item.imageDataUrl ? await optimizeImageDataUrl(item.imageDataUrl) : undefined,
        }))),
      }
      const requestBody = JSON.stringify(normalizedQuotation)
      if (new Blob([requestBody]).size > MAX_QUOTATION_REQUEST_BYTES) {
        throw new Error("حجم صور العرض كبير جداً. احذف بعض الصور الكبيرة أو أعد اختيارها ثم حاول مرة أخرى.")
      }
      setQuotation(normalizedQuotation)
      const result = await requestJson<{ quotationNumber: number; pdfUrl: string }>(existing ? `/api/quotations/${existing.id}` : "/api/quotations", { method: existing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: requestBody })
      localStorage.removeItem(DRAFT_KEY)
      setIssued({ number: result.quotationNumber, url: result.pdfUrl })
      router.refresh()
    } catch (issueError) { setError(issueError instanceof Error ? issueError.message : "تعذر إصدار عرض السعر") }
    finally { setSubmitting(false) }
  }

  if (issued) return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-10"><section className="admin-card w-full p-8 text-center">
      <CheckCircle2 className="mx-auto size-14 text-primary" aria-hidden="true" /><h1 className="mt-5 text-3xl font-bold">{existing ? "تم تحديث عرض السعر رقم" : "تم إصدار عرض السعر رقم"} {issued.number}</h1>
      <p className="mt-3 text-muted-foreground">حُفظ ملف PDF والبيانات والبصمة الرقمية في سجل التدقيق.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3"><a href={issued.url} target="_blank" rel="noreferrer" className="admin-primary-button"><Download aria-hidden="true" /> فتح PDF</a><Link href="/admin/quotations" className="admin-secondary-button">العودة إلى الأرشيف</Link></div>
    </section></main>
  )

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-primary">عرض رقم {nextQuotationNumber}</p><h1 className="mt-1 text-3xl font-bold">{existing ? "تعديل عرض سعر" : "إنشاء عرض سعر"}</h1></div><p className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><Save className="size-4" aria-hidden="true" /> تُحفظ المسودة تلقائياً على هذا الجهاز</p></div>
      <form onSubmit={issueQuotation} className="grid items-start gap-7 xl:grid-cols-[minmax(430px,0.78fr)_minmax(650px,1.22fr)]">
        <div className="space-y-5">
          <section className="admin-card p-5">
            <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-lg font-bold">بيانات العرض والعميل</h2><span className="text-xs text-muted-foreground">اختر أو أنشئ دون مغادرة الصفحة</span></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="حالة العرض" wide><select required value={quotation.offerStatus} onChange={(event) => setQuotation((current) => ({ ...current, offerStatus: event.target.value as OfferStatus }))} className="admin-input">{Object.entries(OFFER_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <Field label="العميل" wide><select required value={quotation.customerId} onChange={(event) => selectCustomer(event.target.value)} className="admin-input"><option value="">اختر العميل</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}<option value={CREATE_NEW}>+ إنشاء عميل جديد</option></select></Field>
              {showNewCustomer ? (
                <InlineCreator title="عميل جديد" onClose={() => setShowNewCustomer(false)}>
                  <Field label="اسم العميل" wide><input value={newCustomer.name} onChange={(event) => setNewCustomer((current) => ({ ...current, name: event.target.value }))} className="admin-input" /></Field>
                  <Field label="السجل التجاري"><input value={newCustomer.commercialRegistration} onChange={(event) => setNewCustomer((current) => ({ ...current, commercialRegistration: event.target.value }))} className="admin-input" /></Field>
                  <Field label="الرقم الضريبي"><input value={newCustomer.taxNumber} onChange={(event) => setNewCustomer((current) => ({ ...current, taxNumber: event.target.value }))} className="admin-input" /></Field>
                  <Field label="الحي"><input value={newCustomer.district} onChange={(event) => setNewCustomer((current) => ({ ...current, district: event.target.value }))} className="admin-input" /></Field>
                  <Field label="الشارع"><input value={newCustomer.street} onChange={(event) => setNewCustomer((current) => ({ ...current, street: event.target.value }))} className="admin-input" /></Field>
                  <Field label="رقم المبنى"><input value={newCustomer.buildingNumber} onChange={(event) => setNewCustomer((current) => ({ ...current, buildingNumber: event.target.value }))} className="admin-input" /></Field>
                  <Field label="الرقم الإضافي"><input value={newCustomer.additionalNumber} onChange={(event) => setNewCustomer((current) => ({ ...current, additionalNumber: event.target.value }))} className="admin-input" /></Field>
                  <Field label="الرمز البريدي"><input value={newCustomer.postalCode} onChange={(event) => setNewCustomer((current) => ({ ...current, postalCode: event.target.value }))} className="admin-input" /></Field>
                  <Field label="المدينة / العنوان العام" wide><input value={newCustomer.address} onChange={(event) => setNewCustomer((current) => ({ ...current, address: event.target.value }))} className="admin-input" /></Field>
                  <button type="button" disabled={directoryBusy || newCustomer.name.trim().length < 2} onClick={createNewCustomer} className="admin-primary-button sm:col-span-2"><UserPlus aria-hidden="true" /> حفظ العميل</button>
                </InlineCreator>
              ) : null}
              <Field label="المسؤول"><input required value={quotation.contactName} onChange={(event) => setQuotation((current) => ({ ...current, contactName: event.target.value }))} className="admin-input" placeholder="اسم المسؤول" /></Field>
              <Field label="رقم هاتف المسؤول"><input required inputMode="tel" value={quotation.phone} onChange={(event) => setQuotation((current) => ({ ...current, phone: event.target.value }))} className="admin-input" placeholder="05xxxxxxxx" /></Field>
              <Field label="العنوان" wide><textarea readOnly rows={2} value={quotation.address} className="admin-input min-h-16 resize-none bg-muted/35" placeholder="يُعبأ من العميل" /></Field>
              {selectedCustomer?.commercialRegistration || selectedCustomer?.taxNumber ? (
                <Field label="السجل التجاري / الرقم الضريبي"><input readOnly value={[selectedCustomer.commercialRegistration, selectedCustomer.taxNumber].filter(Boolean).join(" — ")} className="admin-input bg-muted/35" /></Field>
              ) : null}
            </div>
          </section>
          <section className="admin-card p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">المنتجات</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPickerOpen(true)} className="admin-secondary-button"><ListPlus aria-hidden="true" /> اختيار من القائمة</button>
                <button type="button" onClick={() => setQuotation((current) => ({ ...current, items: [...current.items, emptyItem()] }))} className="admin-secondary-button"><Plus aria-hidden="true" /> إضافة منتج</button>
              </div>
            </div>
            <div className="space-y-4">{quotation.items.map((item, index) => <article key={item.id} className="rounded-[var(--radius-lg)] border border-border bg-muted/25 p-4">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">المنتج {index + 1}</h3><button type="button" disabled={quotation.items.length === 1} onClick={() => removeItem(item.id)} className="admin-icon-button text-destructive" aria-label={`حذف المنتج ${index + 1}`}><Trash2 aria-hidden="true" /></button></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="وصف المنتج" wide><textarea required rows={2} value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} className="admin-input min-h-20 resize-y" /></Field>
                <Field label="بلد المنشأ"><input value={item.origin} onChange={(event) => updateItem(item.id, { origin: event.target.value })} className="admin-input" placeholder="مثال: صنع في الصين" /></Field>
                <Field label="الكمية"><input required type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })} className="admin-input" /></Field>
                <Field label="سعر الوحدة"><input required type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(item.id, { unitPrice: Number(event.target.value) })} className="admin-input" /></Field>
                <Field label="الضريبة"><select value={item.vatRate} onChange={(event) => updateItem(item.id, { vatRate: Number(event.target.value) as VatRate })} className="admin-input"><option value={0}>بدون ضريبة</option><option value={15}>ضريبة 15%</option></select></Field>
                <Field label="نوع الخصم">
                  <select
                    value={item.discountType ?? ""}
                    onChange={(event) => updateItem(item.id, { discountType: (event.target.value || null) as DiscountType | null, discountValue: event.target.value ? item.discountValue : 0 })}
                    className="admin-input"
                  >
                    <option value="">بدون خصم</option>
                    <option value="percentage">نسبة %</option>
                    <option value="fixed">مبلغ ثابت</option>
                  </select>
                </Field>
                {item.discountType ? (
                  <Field label={item.discountType === "percentage" ? "قيمة الخصم (%)" : "قيمة الخصم (ر.س)"}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={item.discountType === "percentage" ? 100 : undefined}
                      value={item.discountValue ?? 0}
                      onChange={(event) => updateItem(item.id, { discountValue: Number(event.target.value) })}
                      className="admin-input"
                    />
                  </Field>
                ) : null}
                <Field label="صورة المنتج"><label className="admin-upload"><ImagePlus aria-hidden="true" /><span>{item.imageDataUrl ? "تغيير الصورة" : "اختيار صورة"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImage(item.id, event)} className="sr-only" /></label></Field>
              </div>
            </article>)}</div>
          </section>
          <section className="admin-card p-5">
            <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-lg font-bold">شروط العرض</h2><span className="text-xs text-muted-foreground">قيم افتراضية قابلة للتعديل</span></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="مدة عرض السعر (يوم)"><input type="number" min="1" step="1" value={quotation.validityDays ?? QUOTATION_DEFAULTS.validityDays} onChange={(event) => setQuotation((current) => ({ ...current, validityDays: Number(event.target.value) }))} className="admin-input" /></Field>
              <Field label="مدة التوريد بعد التعميد (أيام)"><input type="number" min="1" step="1" value={quotation.deliveryDays ?? QUOTATION_DEFAULTS.deliveryDays} onChange={(event) => setQuotation((current) => ({ ...current, deliveryDays: Number(event.target.value) }))} className="admin-input" /></Field>
              <Field label="طريقة الدفع" wide><input value={quotation.paymentTerms ?? QUOTATION_DEFAULTS.paymentTerms} onChange={(event) => setQuotation((current) => ({ ...current, paymentTerms: event.target.value }))} className="admin-input" /></Field>
              <Field label="الضمان" wide><textarea rows={2} value={quotation.warranty ?? QUOTATION_DEFAULTS.warranty} onChange={(event) => setQuotation((current) => ({ ...current, warranty: event.target.value }))} className="admin-input min-h-16 resize-y" /></Field>
            </div>
          </section>
          {error ? <p role="alert" className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</p> : null}
          <button disabled={submitting || directoryBusy || imageBusy} className="admin-primary-button min-h-12 w-full text-base">{imageBusy ? "جارٍ تجهيز صورة المنتج..." : submitting ? "جارٍ إنشاء وحفظ ملف PDF..." : (existing ? `حفظ تعديلات عرض السعر رقم ${nextQuotationNumber}` : `إصدار عرض السعر رقم ${nextQuotationNumber}`)}</button>
        </div>
        <section className="admin-preview-panel xl:sticky xl:top-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">معاينة مباشرة</h2><span className="text-xs text-muted-foreground">Letter · صفحة الطباعة</span></div><div className="overflow-auto rounded-[var(--radius-md)] bg-[#dfe4ea] p-3 sm:p-6"><QuotationPreview quotation={quotation} quotationNumber={nextQuotationNumber} /></div></section>
      </form>
      <ProductPickerModal open={pickerOpen} onOpenChange={setPickerOpen} onSelect={addProductFromCatalog} />
    </main>
  )
}

function composeAddress(customer?: Customer) {
  if (!customer) return ""
  const parts = [
    customer.district ? `حي ${customer.district}` : "",
    customer.street ? `شارع ${customer.street}` : "",
    customer.buildingNumber ? `مبنى ${customer.buildingNumber}` : "",
    customer.additionalNumber ? `إضافي ${customer.additionalNumber}` : "",
    customer.postalCode,
    customer.address,
  ].filter(Boolean)
  return parts.join("، ") || customer.address
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`block space-y-2 ${wide ? "sm:col-span-2" : ""}`}><span className="text-sm font-semibold">{label}</span>{children}</label>
}

function InlineCreator({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="sm:col-span-2 rounded-[var(--radius-lg)] border border-primary/25 bg-primary/5 p-4"><div className="mb-4 flex items-center justify-between"><p className="font-bold text-primary">{title}</p><button type="button" onClick={onClose} className="admin-icon-button" aria-label="إغلاق"><X aria-hidden="true" /></button></div><div className="grid gap-4 sm:grid-cols-2">{children}</div></div>
}
