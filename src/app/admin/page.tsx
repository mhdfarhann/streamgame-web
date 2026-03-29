// app/admin/page.tsx - VERSI AMAN
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Cek role dari database, bukan dari email hardcode
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userData?.role !== "admin") {
    redirect("/dashboard")
  }

  // Pakai service role untuk lihat semua order (bypass RLS)
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*, users(email, name), games(name, slug)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">Admin — StreamGame</span>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white">
          Ke Dashboard
        </a>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Daftar Order</h1>
        <AdminClient orders={orders ?? []} />
      </main>
    </div>
  )
}