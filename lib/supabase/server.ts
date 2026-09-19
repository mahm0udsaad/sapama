import { createClient, type SupabaseClient } from "@supabase/supabase-js"

type SupabaseGlobal = typeof globalThis & { __madmakSupabase?: SupabaseClient<any, any, any> }
const supabaseGlobal = globalThis as SupabaseGlobal

export function getSupabase(): SupabaseClient<any, any, any> {
  if (!supabaseGlobal.__madmakSupabase) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error("متغيرات SUPABASE_URL أو SUPABASE_SERVICE_ROLE_KEY غير مضبوطة")
    supabaseGlobal.__madmakSupabase = createClient<any, any, any>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return supabaseGlobal.__madmakSupabase
}
