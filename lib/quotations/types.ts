export type VatRate = 0 | 15
export type OfferStatus = "temporary" | "approved" | "in_progress" | "sent" | "expired"

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  temporary: "مؤقت",
  approved: "تم التعميد",
  in_progress: "قيد التنفيذ",
  sent: "تم الإرسال",
  expired: "منتهي",
}

export type UserRole = "admin" | "sales"

export type AppUser = {
  id: string
  username: string
  displayName: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export type CurrentUser = {
  username: string
  role: UserRole
  displayName: string
}

export type CustomerContact = {
  id: string
  customerId: string
  name: string
  phone: string
  createdAt: string
}

export type Customer = {
  id: string
  name: string
  address: string
  district: string
  street: string
  postalCode: string
  additionalNumber: string
  buildingNumber: string
  commercialRegistration: string
  taxNumber: string
  createdAt: string
  contacts: CustomerContact[]
}

export type DiscountType = "percentage" | "fixed"

export type Product = {
  id: string
  description: string
  origin: string
  unitPrice: number
  vatRate: VatRate
  imageDataUrl: string | null
  createdAt: string
}

export type QuotationItem = {
  id: string
  description: string
  origin: string
  quantity: number
  unitPrice: number
  vatRate: VatRate
  imageDataUrl?: string
  discountType?: DiscountType | null
  discountValue?: number
  productId?: string | null
}

export type QuotationInput = {
  customerId: string
  customerName: string
  contactId: string
  contactName: string
  phone: string
  address: string
  customerCommercialRegistration?: string
  customerTaxNumber?: string
  offerStatus: OfferStatus
  items: QuotationItem[]
  validityDays?: number
  deliveryDays?: number
  paymentTerms?: string
  warranty?: string
}

export type QuotationStatus = "processing" | "issued" | "cancelled" | "failed"

export type StoredQuotation = QuotationInput & {
  id: string
  quotationNumber: number
  status: QuotationStatus
  issueDate: string
  createdAt: string
  updatedAt: string
  issuedAt: string | null
  cancelledAt: string | null
  createdBy: string
  pdfSha256: string | null
  templateVersion: string
}

export type QuotationSummary = Pick<
  StoredQuotation,
  | "id"
  | "quotationNumber"
  | "customerName"
  | "offerStatus"
  | "status"
  | "issueDate"
  | "createdAt"
  | "issuedAt"
  | "pdfSha256"
  | "createdBy"
> & {
  total: number
  createdByName: string
}
