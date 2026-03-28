import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

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
    <div className="min-h-screen">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">StreamGame</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">
            {user.email}
          </span>
          <form action="/auth/logout" method="POST">
            <button className="text-sm text-gray-400 hover:text-white transition">
              Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              Halo, {userData?.name?.split(" ")[0] ?? "Streamer"}!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Plan:{" "}
              <span className="capitalize text-white">{userData?.plan ?? "free"}</span>
            </p>
          </div>
          <Link
            href="/dashboard/store"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition"
          >
            + Beli Game
          </Link>
        </div>

        {/* Widget list */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Widget saya</h2>

          {widgets && widgets.length > 0 ? (
            <div className="space-y-3">
              {widgets.map((w: any) => (
                <div
                  key={w.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{w.name}</p>
                    <p className="text-sm text-gray-400">{w.games?.name}</p>
                    <p className="text-xs text-gray-600 mt-1 font-mono truncate">
                      /overlay/{w.id}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/dashboard/widgets/${w.id}`}
                      className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
                    >
                      Kelola
                    </Link>
                    <Link
                      href={`/control/${w.id}`}
                      target="_blank"
                      className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition"
                    >
                      Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center space-y-3">
              <p className="text-gray-400">Belum ada widget.</p>
              <Link
                href="/dashboard/store"
                className="inline-block text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition"
              >
                Beli game pertama →
              </Link>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}