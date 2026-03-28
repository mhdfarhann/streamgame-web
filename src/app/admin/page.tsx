import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminClient from "./adminClient"

const ADMIN_EMAIL = "emailkamu@gmail.com" // ganti dengan email kamu

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      users(email, name),
      games(name, slug)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <span className="font-semibold">Admin — StreamGame</span>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Daftar Order</h1>
        <AdminClient orders={orders ?? []} />
      </main>
    </div>
  )
}