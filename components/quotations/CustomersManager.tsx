"use client"

import { FormEvent, useMemo, useState } from "react"
import { Building2, Pencil, Plus, RotateCcw, Search, UserPlus } from "lucide-react"
import type { Customer } from "@/lib/quotations/types"

const EMPTY_FORM = {
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
  const response = await fetch(url, options)
  const result = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(result.error || "تعذر حفظ البيانات")
  return result
}

export default function CustomersManager({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [contact, setContact] = useState({ name: "", phone: "" })
  const [submitting, setSubmitting] = useState(false)
  const [contactBusy, setContactBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const visibleCustomers = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar")
    if (!term) return customers
    return customers.filter((customer) =>
      `${customer.name} ${customer.address} ${customer.contacts.map((entry) => `${entry.name} ${entry.phone}`).join(" ")} ${customer.commercialRegistration}`.toLocaleLowerCase("ar").includes(term),
    )
  }, [customers, query])

  const editingCustomer = customers.find((customer) => customer.id === editingId)

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setContact({ name: "", phone: "" })
    setError("")
  }

  function editCustomer(customer: Customer) {
    setEditingId(customer.id)
    setForm({
      name: customer.name,
      address: customer.address,
      district: customer.district,
      street: customer.street,
      postalCode: customer.postalCode,
      additionalNumber: customer.additionalNumber,
      buildingNumber: customer.buildingNumber,
      commercialRegistration: customer.commercialRegistration,
      taxNumber: customer.taxNumber,
    })
    setError("")
    setSuccess("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function saveCustomer(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const url = editingId ? `/api/customers/${editingId}` : "/api/customers"
      const { customer } = await requestJson<{ customer: Customer }>(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setCustomers((current) => editingId
        ? current.map((entry) => entry.id === customer.id ? customer : entry)
        : [...current, customer].toSorted((a, b) => a.name.localeCompare(b.name, "ar")))
      setSuccess(editingId ? "تم تحديث بيانات العميل." : "تمت إضافة العميل.")
      resetForm()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ العميل")
    } finally {
      setSubmitting(false)
    }
  }

  async function addContact(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    setContactBusy(true)
    setError("")
    try {
      const result = await requestJson<{ contact: Customer["contacts"][number] }>(`/api/customers/${editingId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      setCustomers((current) => current.map((customer) => customer.id === editingId
        ? { ...customer, contacts: [...customer.contacts, result.contact] }
        : customer))
      setContact({ name: "", phone: "" })
      setSuccess("تمت إضافة مسؤول التواصل.")
    } catch (contactError) {
      setError(contactError instanceof Error ? contactError.message : "تعذر إضافة مسؤول التواصل")
    } finally {
      setContactBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-1 text-sm font-bold text-primary">دليل العملاء</p><h1 className="text-3xl font-bold">العملاء</h1><p className="mt-2 text-muted-foreground">إدارة بيانات المنشآت ومسؤولي التواصل المستخدمين في عروض الأسعار.</p></div>
        {editingId ? <button type="button" onClick={resetForm} className="admin-secondary-button"><RotateCcw aria-hidden="true" /> عميل جديد</button> : null}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(420px,0.8fr)_minmax(560px,1.2fr)]">
        <section className="admin-card p-5 xl:sticky xl:top-5">
          <div className="mb-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary"><Building2 aria-hidden="true" /></span><div><h2 className="font-bold">{editingId ? "تعديل العميل" : "إضافة عميل"}</h2><p className="text-xs text-muted-foreground">{editingId ? editingCustomer?.name : "سجل جديد"}</p></div></div>
          <form onSubmit={saveCustomer} className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم العميل" wide><input required minLength={2} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="admin-input" /></Field>
            <Field label="السجل التجاري"><input value={form.commercialRegistration} onChange={(event) => setForm((current) => ({ ...current, commercialRegistration: event.target.value }))} className="admin-input" /></Field>
            <Field label="الرقم الضريبي"><input value={form.taxNumber} onChange={(event) => setForm((current) => ({ ...current, taxNumber: event.target.value }))} className="admin-input" /></Field>
            <Field label="الحي"><input value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} className="admin-input" /></Field>
            <Field label="الشارع"><input value={form.street} onChange={(event) => setForm((current) => ({ ...current, street: event.target.value }))} className="admin-input" /></Field>
            <Field label="رقم المبنى"><input value={form.buildingNumber} onChange={(event) => setForm((current) => ({ ...current, buildingNumber: event.target.value }))} className="admin-input" /></Field>
            <Field label="الرقم الإضافي"><input value={form.additionalNumber} onChange={(event) => setForm((current) => ({ ...current, additionalNumber: event.target.value }))} className="admin-input" /></Field>
            <Field label="الرمز البريدي"><input value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} className="admin-input" /></Field>
            <Field label="المدينة / العنوان العام" wide><input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} className="admin-input" /></Field>
            <button disabled={submitting} className="admin-primary-button sm:col-span-2"><Plus aria-hidden="true" /> {submitting ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة العميل"}</button>
          </form>

          {editingId ? <div className="mt-6 border-t border-border pt-5"><h3 className="mb-3 font-bold">مسؤولو التواصل</h3><div className="mb-4 space-y-2">{editingCustomer?.contacts.map((entry) => <div key={entry.id} className="flex justify-between gap-3 rounded-[var(--radius-md)] bg-muted/60 px-3 py-2 text-sm"><span className="font-semibold">{entry.name}</span><span dir="ltr" className="text-muted-foreground">{entry.phone}</span></div>)}{!editingCustomer?.contacts.length ? <p className="text-sm text-muted-foreground">لا يوجد مسؤولون مسجلون.</p> : null}</div><form onSubmit={addContact} className="grid gap-3 sm:grid-cols-2"><Field label="اسم المسؤول"><input required minLength={2} value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} className="admin-input" /></Field><Field label="رقم الهاتف"><input required minLength={7} dir="ltr" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} className="admin-input text-right" /></Field><button disabled={contactBusy} className="admin-secondary-button sm:col-span-2"><UserPlus aria-hidden="true" /> {contactBusy ? "جارٍ الإضافة..." : "إضافة مسؤول"}</button></form></div> : null}
          {error ? <p role="alert" className="mt-4 text-sm font-semibold text-destructive">{error}</p> : null}
          {success ? <p role="status" className="mt-4 text-sm font-semibold text-primary">{success}</p> : null}
        </section>

        <section className="admin-card overflow-hidden">
          <div className="border-b border-border p-4"><label className="relative block"><span className="sr-only">البحث في العملاء</span><Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-input pr-10" placeholder="ابحث بالاسم أو العنوان أو السجل التجاري" /></label></div>
          <div className="divide-y divide-border">{visibleCustomers.map((customer) => <article key={customer.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="font-bold">{customer.name}</h3><p className="mt-1 text-sm text-muted-foreground">{[customer.district, customer.street, customer.address].filter(Boolean).join("، ") || "لا يوجد عنوان"}</p><p className="mt-2 text-xs text-muted-foreground">{customer.contacts.length} مسؤول تواصل {customer.commercialRegistration ? `· س.ت ${customer.commercialRegistration}` : ""}</p></div><button type="button" onClick={() => editCustomer(customer)} className="admin-secondary-button shrink-0"><Pencil aria-hidden="true" /> تعديل</button></article>)}{!visibleCustomers.length ? <p className="px-5 py-16 text-center text-muted-foreground">لا توجد نتائج مطابقة.</p> : null}</div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`block space-y-2 ${wide ? "sm:col-span-2" : ""}`}><span className="text-sm font-semibold">{label}</span>{children}</label>
}
