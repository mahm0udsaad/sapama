"use client"

import { FormEvent, useState } from "react"
import { Ban, CheckCircle2, UserPlus } from "lucide-react"
import type { AppUser, UserRole } from "@/lib/quotations/types"

const ROLE_LABELS: Record<UserRole, string> = { admin: "مدير", sales: "مبيعات" }

const EMPTY_FORM = { username: "", password: "", displayName: "", role: "sales" as UserRole }

export default function UsersManager({ initialUsers }: { initialUsers: AppUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)

  async function createUser(event: FormEvent) {
    event.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "تعذر إنشاء المستخدم")
      setUsers((current) => [...current, result.user])
      setForm(EMPTY_FORM)
    } catch (creationError) {
      setError(creationError instanceof Error ? creationError.message : "تعذر إنشاء المستخدم")
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(user: AppUser) {
    setBusyId(user.id)
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    })
    setBusyId(null)
    if (response.ok) {
      setUsers((current) => current.map((entry) => (entry.id === user.id ? { ...entry, isActive: !entry.isActive } : entry)))
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-7">
        <p className="mb-1 text-sm font-bold text-primary">إدارة الفريق</p>
        <h1 className="text-3xl font-bold">المستخدمون</h1>
        <p className="mt-2 text-muted-foreground">أنشئ حسابات لأعضاء الفريق ليتمكنوا من إنشاء عروض الأسعار.</p>
      </div>

      <section className="admin-card mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold">مستخدم جديد</h2>
        <form onSubmit={createUser} className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المستخدم">
            <input
              required
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              className="admin-input"
              placeholder="english_username"
            />
          </Field>
          <Field label="الاسم الظاهر">
            <input
              required
              value={form.displayName}
              onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
              className="admin-input"
            />
          </Field>
          <Field label="كلمة المرور">
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="admin-input"
            />
          </Field>
          <Field label="الصلاحية">
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))}
              className="admin-input"
            >
              <option value="sales">مبيعات</option>
              <option value="admin">مدير</option>
            </select>
          </Field>
          {error ? <p role="alert" className="sm:col-span-2 text-sm font-semibold text-destructive">{error}</p> : null}
          <button disabled={submitting} className="admin-primary-button sm:col-span-2">
            <UserPlus aria-hidden="true" /> {submitting ? "جارٍ الإنشاء..." : "إنشاء المستخدم"}
          </button>
        </form>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-right text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">اسم المستخدم</th>
                <th className="px-5 py-3 font-semibold">الاسم الظاهر</th>
                <th className="px-5 py-3 font-semibold">الصلاحية</th>
                <th className="px-5 py-3 font-semibold">الحالة</th>
                <th className="px-5 py-3 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="bg-card">
                  <td className="px-5 py-4 font-semibold">{user.username}</td>
                  <td className="px-5 py-4">{user.displayName}</td>
                  <td className="px-5 py-4">{ROLE_LABELS[user.role]}</td>
                  <td className="px-5 py-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-primary"><CheckCircle2 className="size-4" aria-hidden="true" /> نشط</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-destructive"><Ban className="size-4" aria-hidden="true" /> معطل</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button disabled={busyId === user.id} onClick={() => toggleActive(user)} className="admin-secondary-button">
                      {user.isActive ? "تعطيل" : "تفعيل"}
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-muted-foreground">لا يوجد مستخدمون بعد.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}
