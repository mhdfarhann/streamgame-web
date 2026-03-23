// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Cek session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Ambil data user + widget sekaligus
  const { data: userData } = await supabase
    .from("users")
    .select("name, plan")
    .eq("id", user.id)
    .single()

  const { data: widgets } = await supabase
    .from("widgets")
    .select("*, games(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-lg">StreamGame</span>
        <span className="text-sm text-gray-400">{user.email}</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Halo, {userData?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Plan: <span className="capitalize text-white">{userData?.plan}</span>
          </p>
        </div>

        <section>
          <h2 className="text-lg font-medium mb-4">Widget saya</h2>
          {widgets && widgets.length > 0 ? (
            <div className="space-y-3">
              {widgets.map((w: any) => (
                <div key={w.id} className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{w.name}</p>
                    <p className="text-sm text-gray-400">{w.games?.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">/overlay/{w.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/dashboard/widgets/${w.id}`}
                      className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg">
                      Kelola
                    </a>
                    <a href={`/control/${w.id}`} target="_blank"
                      className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">
                      Live
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <p className="text-gray-400">Belum ada widget.</p>
              <a href="/dashboard/store"
                className="mt-3 inline-block text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg">
                Beli game pertama →
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}