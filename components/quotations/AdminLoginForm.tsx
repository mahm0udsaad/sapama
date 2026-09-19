"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole } from "lucide-react"

export default function AdminLoginForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
    })
    const result = await response.json()
    setSubmitting(false)
    if (!response.ok) {
      setError(result.error ?? "تعذر تسجيل الدخول")
      return
    }
    router.replace("/admin/quotations")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="admin-card w-full max-w-md space-y-6 p-7">
      <div className="flex size-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
        <LockKeyhole aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">دخول إدارة عروض الأسعار</h1>
        <p className="mt-2 text-sm text-muted-foreground">هذه المنطقة مخصصة للموظفين المصرح لهم.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-semibold">اسم المستخدم</label>
        <input id="username" name="username" autoComplete="username" required className="admin-input" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold">كلمة المرور</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="admin-input" />
      </div>
      {error ? <p role="alert" className="text-sm font-semibold text-destructive">{error}</p> : null}
      <button disabled={submitting} className="admin-primary-button w-full">
        {submitting ? "جارٍ التحقق..." : "دخول"}
      </button>
    </form>
  )
}

