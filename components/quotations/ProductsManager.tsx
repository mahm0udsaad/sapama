"use client"

import { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { Boxes, ImageIcon, ImagePlus, Pencil, Plus, RotateCcw, Search, X } from "lucide-react"
import { formatMoney } from "@/lib/quotations/calculations"
import type { Product, VatRate } from "@/lib/quotations/types"

const EMPTY_FORM = { description: "", origin: "", unitPrice: 0, vatRate: 0 as VatRate, imageDataUrl: null as string | null }

async function requestJson<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const result = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(result.error || "تعذر حفظ البيانات")
  return result
}

export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar")
    if (!term) return products
    return products.filter((product) => `${product.description} ${product.origin}`.toLocaleLowerCase("ar").includes(term))
  }, [products, query])

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError("")
  }

  function editProduct(product: Product) {
    setEditingId(product.id)
    setForm({ description: product.description, origin: product.origin, unitPrice: product.unitPrice, vatRate: product.vatRate, imageDataUrl: product.imageDataUrl })
    setError("")
    setSuccess("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2_000_000) { setError("حجم الصورة يجب ألا يتجاوز 2 ميجابايت."); return }
    setImageBusy(true)
    setError("")
    try {
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("تعذر قراءة الصورة"))
        reader.readAsDataURL(file)
      })
      setForm((current) => ({ ...current, imageDataUrl }))
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "تعذر قراءة الصورة")
    } finally {
      setImageBusy(false)
      event.target.value = ""
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products"
      const { product } = await requestJson<{ product: Product }>(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setProducts((current) => editingId
        ? current.map((entry) => entry.id === product.id ? product : entry)
        : [product, ...current])
      setSuccess(editingId ? "تم تحديث المنتج." : "تمت إضافة المنتج.")
      resetForm()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ المنتج")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-1 text-sm font-bold text-primary">كتالوج المنتجات</p><h1 className="text-3xl font-bold">المنتجات</h1><p className="mt-2 text-muted-foreground">إدارة الصور والأسعار والضريبة وبلد المنشأ المستخدمة عند إنشاء العروض.</p></div>
        {editingId ? <button type="button" onClick={resetForm} className="admin-secondary-button"><RotateCcw aria-hidden="true" /> منتج جديد</button> : null}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(390px,0.72fr)_minmax(620px,1.28fr)]">
        <section className="admin-card p-5 xl:sticky xl:top-5">
          <div className="mb-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary"><Boxes aria-hidden="true" /></span><div><h2 className="font-bold">{editingId ? "تعديل المنتج" : "إضافة منتج"}</h2><p className="text-xs text-muted-foreground">{editingId ? "سيظهر التحديث في الاختيارات الجديدة" : "منتج جديد في الكتالوج"}</p></div></div>
          <form onSubmit={saveProduct} className="space-y-4">
            <Field label="وصف المنتج"><textarea required minLength={2} rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="admin-input min-h-28 resize-y" /></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="بلد المنشأ"><input value={form.origin} onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))} className="admin-input" /></Field><Field label="سعر الوحدة"><input required type="number" min="0" step="0.01" value={form.unitPrice} onChange={(event) => setForm((current) => ({ ...current, unitPrice: Number(event.target.value) }))} className="admin-input" /></Field></div>
            <Field label="الضريبة"><select value={form.vatRate} onChange={(event) => setForm((current) => ({ ...current, vatRate: Number(event.target.value) as VatRate }))} className="admin-input"><option value={0}>بدون ضريبة</option><option value={15}>ضريبة 15%</option></select></Field>
            <div><p className="mb-2 text-sm font-semibold">صورة المنتج</p><div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border p-3"><div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-muted">{form.imageDataUrl ? <img src={form.imageDataUrl} alt="معاينة صورة المنتج" className="size-full object-contain" /> : <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />}</div><div className="flex flex-wrap gap-2"><label className="admin-upload"><ImagePlus aria-hidden="true" /> {imageBusy ? "جارٍ القراءة..." : "اختيار صورة"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} className="sr-only" /></label>{form.imageDataUrl ? <button type="button" onClick={() => setForm((current) => ({ ...current, imageDataUrl: null }))} className="admin-secondary-button"><X aria-hidden="true" /> إزالة</button> : null}</div></div></div>
            {error ? <p role="alert" className="text-sm font-semibold text-destructive">{error}</p> : null}
            {success ? <p role="status" className="text-sm font-semibold text-primary">{success}</p> : null}
            <button disabled={submitting || imageBusy} className="admin-primary-button min-h-11 w-full"><Plus aria-hidden="true" /> {submitting ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}</button>
          </form>
        </section>

        <section className="admin-card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><label className="relative min-w-[240px] flex-1"><span className="sr-only">البحث في المنتجات</span><Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-input pr-10" placeholder="ابحث بالوصف أو بلد المنشأ" /></label><span className="text-sm font-semibold text-muted-foreground">{visibleProducts.length} منتج</span></div>
          <div className="divide-y divide-border">{visibleProducts.map((product) => <article key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-muted">{product.imageDataUrl ? <img src={product.imageDataUrl} alt="" loading="lazy" className="size-full object-contain" /> : <ImageIcon className="size-7 text-muted-foreground" aria-hidden="true" />}</div><div className="min-w-0 flex-1"><h3 className="line-clamp-2 font-bold leading-7">{product.description}</h3><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span>{product.origin || "بلد المنشأ غير محدد"}</span><span className="font-semibold text-foreground">{formatMoney(product.unitPrice)} ر.س</span><span>{product.vatRate ? `ضريبة ${product.vatRate}%` : "بدون ضريبة"}</span></div></div><button type="button" onClick={() => editProduct(product)} className="admin-secondary-button shrink-0"><Pencil aria-hidden="true" /> تعديل</button></article>)}{!visibleProducts.length ? <p className="px-5 py-16 text-center text-muted-foreground">لا توجد نتائج مطابقة.</p> : null}</div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="text-sm font-semibold">{label}</span>{children}</label>
}
