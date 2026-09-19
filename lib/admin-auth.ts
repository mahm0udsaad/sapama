import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { authenticateUser, getUserByUsername } from "@/lib/users/store"
import type { CurrentUser } from "@/lib/quotations/types"

export const ADMIN_COOKIE = "madmak_admin_session"

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? ""
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex")
}

export function createAdminSession(username: string) {
  if (!getSessionSecret()) throw new Error("ADMIN_SESSION_SECRET is not configured")
  const issuedAt = Date.now().toString()
  const payload = Buffer.from(`${username}:${issuedAt}`).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifySessionCookie(value?: string) {
  if (!value || !getSessionSecret()) return null
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null

  const expected = sign(payload)
  if (signature.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8")
    const separator = decoded.lastIndexOf(":")
    const username = decoded.slice(0, separator)
    const issuedAt = Number(decoded.slice(separator + 1))
    const maxAge = 60 * 60 * 12 * 1000
    if (!username || !issuedAt || Date.now() - issuedAt > maxAge) return null
    return username
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies()
  const username = verifySessionCookie(cookieStore.get(ADMIN_COOKIE)?.value)
  if (!username) return null
  const user = await getUserByUsername(username)
  if (!user) return null
  return { username: user.username, role: user.role, displayName: user.displayName }
}

export async function getAdminUsername() {
  const user = await getCurrentUser()
  return user?.username ?? null
}

export async function validAdminCredentials(username: string, password: string) {
  const user = await authenticateUser(username, password)
  return Boolean(user)
}
