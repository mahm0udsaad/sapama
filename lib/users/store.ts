import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from "node:crypto"
import { getSupabase } from "@/lib/supabase/server"
import type { AppUser, UserRole } from "@/lib/quotations/types"

type UserRow = {
  id: string
  username: string
  password_hash: string
  display_name: string
  role: UserRole
  is_active: boolean
  created_at: string
}

function mapUser(row: UserRow): AppUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derived = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, derivedHex] = stored.split(":")
  if (!salt || !derivedHex) return false
  const derived = scryptSync(password, salt, 64)
  const expected = Buffer.from(derivedHex, "hex")
  if (derived.length !== expected.length) return false
  return timingSafeEqual(derived, expected)
}

let seedChecked = false

export async function ensureSeedAdmin() {
  if (seedChecked) return
  const db = getSupabase()
  const { count, error } = await db.from("app_users").select("id", { count: "exact", head: true })
  if (error) throw error
  if (!count) {
    const username = process.env.ADMIN_USERNAME ?? "admin"
    const password = process.env.ADMIN_PASSWORD ?? ""
    if (password) {
      const now = new Date().toISOString()
      await db.from("app_users").insert({
        id: randomUUID(),
        username,
        password_hash: hashPassword(password),
        display_name: "المدير",
        role: "admin",
        is_active: true,
        created_at: now,
        updated_at: now,
      })
    }
  }
  seedChecked = true
}

export async function findUserByUsername(username: string) {
  const db = getSupabase()
  const { data, error } = await db.from("app_users").select("*").eq("username", username).maybeSingle()
  if (error) throw error
  return data as UserRow | null
}

export async function authenticateUser(username: string, password: string) {
  await ensureSeedAdmin()
  const trimmed = username.trim()
  if (!trimmed || !password) return null
  const user = await findUserByUsername(trimmed)
  if (!user || !user.is_active) return null
  if (!verifyPassword(password, user.password_hash)) return null
  return mapUser(user)
}

export async function getUserByUsername(username: string) {
  const user = await findUserByUsername(username)
  return user && user.is_active ? mapUser(user) : null
}

export async function listUsers(): Promise<AppUser[]> {
  const db = getSupabase()
  const { data, error } = await db.from("app_users").select("*").order("created_at")
  if (error) throw error
  return ((data ?? []) as UserRow[]).map(mapUser)
}

export async function createUser(input: { username: string; password: string; displayName: string; role: UserRole }) {
  const db = getSupabase()
  const existing = await findUserByUsername(input.username)
  if (existing) throw new Error("اسم المستخدم مستخدم بالفعل")
  const id = randomUUID()
  const now = new Date().toISOString()
  const { error } = await db.from("app_users").insert({
    id,
    username: input.username,
    password_hash: hashPassword(input.password),
    display_name: input.displayName,
    role: input.role,
    is_active: true,
    created_at: now,
    updated_at: now,
  })
  if (error) throw error
  return { id, username: input.username, displayName: input.displayName, role: input.role, isActive: true, createdAt: now } satisfies AppUser
}

export async function setUserActive(id: string, isActive: boolean) {
  const db = getSupabase()
  const { error } = await db.from("app_users").update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) throw error
}
