import { randomUUID } from "node:crypto"
import { getSupabase } from "@/lib/supabase/server"
import { TEMPLATE_VERSION } from "./constants"
import { quotationTotals } from "./calculations"
import type {
  Customer,
  CustomerContact,
  OfferStatus,
  QuotationInput,
  QuotationStatus,
  QuotationSummary,
  StoredQuotation,
} from "./types"

export const PDF_BUCKET = "quotation-pdfs"

type QuotationRow = {
  id: string
  quotation_number: number
  status: QuotationStatus
  offer_status: OfferStatus
  issue_date: string
  payload: QuotationInput
  total: number
  created_by: string
  created_at: string
  updated_at: string
  issued_at: string | null
  cancelled_at: string | null
  pdf_path: string | null
  pdf_sha256: string | null
  template_version: string
}

function mapStoredQuotation(row: QuotationRow): StoredQuotation {
  const payload = row.payload ?? ({} as Partial<QuotationInput>)
  return {
    customerId: payload.customerId ?? "",
    customerName: payload.customerName ?? "",
    contactId: payload.contactId ?? "",
    contactName: payload.contactName ?? "",
    phone: payload.phone ?? "",
    address: payload.address ?? "",
    customerCommercialRegistration: payload.customerCommercialRegistration ?? "",
    customerTaxNumber: payload.customerTaxNumber ?? "",
    offerStatus: row.offer_status ?? payload.offerStatus ?? "temporary",
    items: payload.items ?? [],
    id: row.id,
    quotationNumber: row.quotation_number,
    status: row.status,
    issueDate: row.issue_date,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    issuedAt: row.issued_at,
    cancelledAt: row.cancelled_at,
    pdfSha256: row.pdf_sha256,
    templateVersion: row.template_version,
  }
}

export async function getNextQuotationNumber() {
  const db = getSupabase()
  const { data, error } = await db.rpc("peek_quotation_number_seq")
  if (error) throw error
  return data as number
}

export async function reserveQuotation(input: QuotationInput, actor: string) {
  const db = getSupabase()
  const id = randomUUID()
  const now = new Date().toISOString()
  const issueDate = now.slice(0, 10)
  const total = quotationTotals(input).total

  const { data: numberData, error: numberError } = await db.rpc("next_quotation_number")
  if (numberError) throw numberError
  const quotationNumber = numberData as number

  const { error } = await db.from("quotations").insert({
    id,
    quotation_number: quotationNumber,
    status: "processing",
    offer_status: input.offerStatus,
    issue_date: issueDate,
    payload: input,
    total,
    created_by: actor,
    created_at: now,
    updated_at: now,
    template_version: TEMPLATE_VERSION,
  })
  if (error) throw error

  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "number_reserved",
    actor,
    details: { quotationNumber },
    created_at: now,
  })

  return { id, quotationNumber, issueDate }
}

export async function finalizeQuotation(id: string, pdfPath: string, sha256: string, actor: string) {
  const db = getSupabase()
  const now = new Date().toISOString()
  await db
    .from("quotations")
    .update({ status: "issued", pdf_path: pdfPath, pdf_sha256: sha256, issued_at: now, updated_at: now })
    .eq("id", id)
    .eq("status", "processing")

  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "issued",
    actor,
    details: { sha256, templateVersion: TEMPLATE_VERSION },
    created_at: now,
  })
}

export async function failQuotation(id: string, actor: string, errorMessage: string) {
  const db = getSupabase()
  const now = new Date().toISOString()
  await db.from("quotations").update({ status: "failed", updated_at: now }).eq("id", id)
  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "generation_failed",
    actor,
    details: { error: errorMessage.slice(0, 500) },
    created_at: now,
  })
}

export async function listQuotations(search = ""): Promise<QuotationSummary[]> {
  const db = getSupabase()
  let query = db
    .from("quotations")
    .select("id, quotation_number, status, offer_status, issue_date, payload, total, created_at, issued_at, pdf_sha256")
    .neq("status", "processing")
    .order("quotation_number", { ascending: false })
    .limit(250)

  const term = search.trim()
  if (term) {
    if (/^\d+$/.test(term)) {
      query = query.eq("quotation_number", Number(term))
    } else {
      query = query.ilike("payload->>customerName", `%${term}%`)
    }
  }

  const { data, error } = await query
  if (error) throw error
  const rows = (data ?? []) as unknown as QuotationRow[]

  return rows.map((row) => ({
    id: row.id,
    quotationNumber: row.quotation_number,
    status: row.status,
    offerStatus: row.offer_status ?? row.payload?.offerStatus ?? "temporary",
    customerName: row.payload?.customerName ?? "—",
    issueDate: row.issue_date,
    createdAt: row.created_at,
    issuedAt: row.issued_at,
    pdfSha256: row.pdf_sha256,
    total: row.total,
  }))
}

export async function getQuotation(id: string) {
  const db = getSupabase()
  const { data, error } = await db.from("quotations").select("*").eq("id", id).maybeSingle()
  if (error) throw error
  return data ? mapStoredQuotation(data as unknown as QuotationRow) : null
}

export async function getQuotationPdf(id: string) {
  const db = getSupabase()
  const { data, error } = await db
    .from("quotations")
    .select("pdf_path, quotation_number, status")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return data as { pdf_path: string | null; quotation_number: number; status: QuotationStatus } | undefined
}

export async function cancelQuotation(id: string, actor: string) {
  const db = getSupabase()
  const now = new Date().toISOString()
  const { data, error } = await db
    .from("quotations")
    .update({ status: "cancelled", cancelled_at: now, updated_at: now })
    .eq("id", id)
    .eq("status", "issued")
    .select("id")
  if (error) throw error
  if (!data?.length) return false
  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "cancelled",
    actor,
    details: {},
    created_at: now,
  })
  return true
}

type CustomerRow = {
  id: string
  name: string
  address: string
  district: string | null
  street: string | null
  postal_code: string | null
  additional_number: string | null
  building_number: string | null
  commercial_registration: string | null
  tax_number: string | null
  created_at: string
}
type ContactRow = { id: string; customer_id: string; name: string; phone: string; created_at: string }

function mapCustomer(row: CustomerRow, contacts: CustomerContact[]): Customer {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? "",
    district: row.district ?? "",
    street: row.street ?? "",
    postalCode: row.postal_code ?? "",
    additionalNumber: row.additional_number ?? "",
    buildingNumber: row.building_number ?? "",
    commercialRegistration: row.commercial_registration ?? "",
    taxNumber: row.tax_number ?? "",
    createdAt: row.created_at,
    contacts,
  }
}

export async function listCustomers(): Promise<Customer[]> {
  const db = getSupabase()
  const [{ data: customers, error: customersError }, { data: contacts, error: contactsError }] = await Promise.all([
    db
      .from("customers")
      .select(
        "id, name, address, district, street, postal_code, additional_number, building_number, commercial_registration, tax_number, created_at",
      )
      .order("name"),
    db.from("customer_contacts").select("id, customer_id, name, phone, created_at").order("name"),
  ])
  if (customersError) throw customersError
  if (contactsError) throw contactsError

  const contactsByCustomer = new Map<string, CustomerContact[]>()
  for (const contact of (contacts ?? []) as ContactRow[]) {
    const group = contactsByCustomer.get(contact.customer_id) ?? []
    group.push({ id: contact.id, customerId: contact.customer_id, name: contact.name, phone: contact.phone, createdAt: contact.created_at })
    contactsByCustomer.set(contact.customer_id, group)
  }

  return ((customers ?? []) as CustomerRow[]).map((row) => mapCustomer(row, contactsByCustomer.get(row.id) ?? []))
}

export async function createCustomer(
  input: {
    name: string
    address: string
    district: string
    street: string
    postalCode: string
    additionalNumber: string
    buildingNumber: string
    commercialRegistration: string
    taxNumber: string
  },
  actor: string,
): Promise<Customer> {
  const db = getSupabase()
  const id = randomUUID()
  const now = new Date().toISOString()
  const { error } = await db.from("customers").insert({
    id,
    name: input.name,
    address: input.address,
    district: input.district,
    street: input.street,
    postal_code: input.postalCode,
    additional_number: input.additionalNumber,
    building_number: input.buildingNumber,
    commercial_registration: input.commercialRegistration,
    tax_number: input.taxNumber,
    created_by: actor,
    created_at: now,
    updated_at: now,
  })
  if (error) throw error
  return {
    id,
    name: input.name,
    address: input.address,
    district: input.district,
    street: input.street,
    postalCode: input.postalCode,
    additionalNumber: input.additionalNumber,
    buildingNumber: input.buildingNumber,
    commercialRegistration: input.commercialRegistration,
    taxNumber: input.taxNumber,
    createdAt: now,
    contacts: [],
  }
}

export async function createCustomerContact(customerId: string, name: string, phone: string, actor: string): Promise<CustomerContact | null> {
  const db = getSupabase()
  const { data: customer } = await db.from("customers").select("id").eq("id", customerId).maybeSingle()
  if (!customer) return null
  const id = randomUUID()
  const now = new Date().toISOString()
  const { error } = await db.from("customer_contacts").insert({
    id,
    customer_id: customerId,
    name,
    phone,
    created_by: actor,
    created_at: now,
    updated_at: now,
  })
  if (error) throw error
  return { id, customerId, name, phone, createdAt: now }
}

export async function updateQuotationOfferStatus(id: string, offerStatus: OfferStatus, actor: string) {
  const db = getSupabase()
  const { data: existing } = await db.from("quotations").select("offer_status").eq("id", id).maybeSingle()
  if (!existing) return false
  const now = new Date().toISOString()
  await db.from("quotations").update({ offer_status: offerStatus, updated_at: now }).eq("id", id)
  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "offer_status_changed",
    actor,
    details: { previousStatus: existing.offer_status, offerStatus },
    created_at: now,
  })
  return true
}

export async function updateQuotationContent(id: string, input: QuotationInput, actor: string) {
  const db = getSupabase()
  const now = new Date().toISOString()
  const { data, error } = await db
    .from("quotations")
    .update({ payload: input, total: quotationTotals(input).total, offer_status: input.offerStatus, updated_at: now })
    .eq("id", id)
    .eq("status", "issued")
    .select("pdf_sha256")
  if (error) throw error
  if (!data?.length) return false
  await db.from("quotation_audit_events").insert({
    id: randomUUID(),
    quotation_id: id,
    action: "edited",
    actor,
    details: { previousSha256: data[0].pdf_sha256 },
    created_at: now,
  })
  return true
}

export async function replaceQuotationPdf(id: string, sha256: string) {
  const db = getSupabase()
  const { error } = await db.from("quotations").update({ pdf_sha256: sha256, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) throw error
}
