import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import CopyButton from "./CopyButton"
import DynamicSettings from "./DynamicSettings"

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
    .select("*, games(name, slug, settings_schema)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!widget) redirect("/dashboard")

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3010"
  const overlayUrl = siteUrl + "/overlay/" + id
  const controlUrl = siteUrl + "/control/" + id
  const schema = widget.games?.settings_schema ?? []

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">StreamGame</span>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {widget.games?.name}
          </p>
          <h1 className="text-2xl font-semibold">{widget.name}</h1>
        </div>

        {/* Link OBS */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <div>
            <p className="text-sm font-medium">Link OBS Browser Source</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste ke OBS → Sources → + → Browser → URL
            </p>
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={overlayUrl}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono"
            />
            <CopyButton text={overlayUrl} />
          </div>
          <div className="bg-gray-800/50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Custom CSS di OBS:</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              {"body { background-color: transparent !important; }"}
            </p>
          </div>
        </div>

        {/* Link Control Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <div>
            <p className="text-sm font-medium">Link Control Panel</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Buka di HP saat sedang live
            </p>
          </div>
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

        {/* Settings dinamis */}
        <DynamicSettings widget={widget} schema={schema} />

      </main>
    </div>
  )
}