import { z } from "zod"

const itemSchema = z.object({
  id: z.string().min(1).max(100),
  description: z.string().trim().min(2).max(500),
  origin: z.string().trim().max(100).default(""),
  quantity: z.coerce.number().positive().max(100000),
  unitPrice: z.coerce.number().nonnegative().max(100000000),
  vatRate: z.union([z.literal(0), z.literal(15)]),
  imageDataUrl: z
    .string()
    .max(3_000_000)
    .refine(
      (value) => !value || /^data:image\/(png|jpe?g|webp);base64,/i.test(value),
      "صيغة صورة غير مدعومة",
    )
    .optional(),
  discountType: z.enum(["percentage", "fixed"]).nullable().optional(),
  discountValue: z.coerce.number().nonnegative().max(100000000).optional(),
  productId: z.string().uuid().nullable().optional(),
})

export const quotationInputSchema = z.object({
  customerId: z.string().uuid(),
  customerName: z.string().trim().min(2).max(200),
  contactId: z.string().max(100).optional().default(""),
  contactName: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(2).max(300),
  customerCommercialRegistration: z.string().trim().max(50).optional(),
  customerTaxNumber: z.string().trim().max(50).optional(),
  offerStatus: z.enum(["temporary", "approved", "in_progress", "sent", "expired"]),
  items: z.array(itemSchema).min(1).max(12),
})

const optionalText = (max: number) => z.string().trim().max(max).optional().default("")

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(200),
  address: optionalText(300),
  district: optionalText(150),
  street: optionalText(150),
  postalCode: optionalText(20),
  additionalNumber: optionalText(20),
  buildingNumber: optionalText(20),
  commercialRegistration: optionalText(50),
  taxNumber: optionalText(50),
})

export const customerContactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(7).max(30),
})

export const offerStatusSchema = z.enum(["temporary", "approved", "in_progress", "sent", "expired"])

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_.-]+$/, "يسمح فقط بحروف إنجليزية وأرقام و . _ -"),
  password: z.string().min(8).max(200),
  displayName: z.string().trim().min(2).max(200),
  role: z.enum(["admin", "sales"]),
})

export const productSchema = z.object({
  description: z.string().trim().min(2).max(500),
  origin: z.string().trim().max(100).optional().default(""),
  unitPrice: z.coerce.number().nonnegative().max(100000000),
  vatRate: z.union([z.literal(0), z.literal(15)]),
  imageDataUrl: z.string().max(3_000_000).nullable().optional(),
})
