import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import CopyButton from "./CopyButton"
import WidgetSettings from "./WidgetSettings"

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: widget } = await supabase
    .from("widgets")
    .select("*, games(name, slug)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!widget) redirect("/dashboard")

  const overlayUrl = process.env.NEXT_PUBLIC_SITE_URL + "/overlay/" + id
  const controlUrl = process.env.NEXT_PUBLIC_SITE_URL + "/control/" + id

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">StreamGame</span>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">{widget.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{widget.games?.name}</p>
        </div>

        {/* Link OBS */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <p className="text-sm font-medium">Link untuk OBS Browser Source</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={overlayUrl}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono"
            />
            <CopyButton text={overlayUrl} />
          </div>
          <p className="text-xs text-gray-500">
            Paste link ini ke OBS → Sources → Browser Source → URL
          </p>
        </div>

        {/* Link Control Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">Control Panel (buka saat live)</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={controlUrl}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono"
            />
            <CopyButton text={controlUrl} />
          </div>
          <Link
            href={"/control/" + id}
            target="_blank"
            className="inline-block text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition"
          >
            Buka Control Panel →
          </Link>
        </div>

        {/* Pengaturan widget */}
        <WidgetSettings widget={widget} />
      </main>
    </div>
  )
}
