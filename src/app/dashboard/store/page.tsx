import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function StorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)

  const { data: purchases } = await supabase
    .from("purchases")
    .select("game_id")
    .eq("user_id", user.id)

  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("game_id")
    .eq("user_id", user.id)
    .eq("status", "pending")

  const ownedGameIds = purchases?.map((p) => p.game_id) ?? []
  const pendingGameIds = pendingOrders?.map((o) => o.game_id) ?? []

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold">StreamGame</span>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Kembali
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">Toko Game</h1>
          <p className="text-gray-400 text-sm mt-1">
            Beli sekali, pakai selamanya. Pembayaran via QRIS.
          </p>
        </div>

        {/* Debug: tampilkan error kalau ada */}
        {gamesError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">Error: {gamesError.message}</p>
          </div>
        )}

        {/* Kalau games kosong */}
        {!games || games.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-400">Belum ada game tersedia.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {games.map((game) => {
              const isOwned = ownedGameIds.includes(game.id)
              const isPending = pendingGameIds.includes(game.id)

              return (
                <div
                  key={game.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4"
                >
                  {/* Preview */}
                  <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {game.slug === "spin-wheel" ? "Spin Wheel" : "Tebak Kartu"}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{game.name}</h3>
                      {isOwned ? (
                        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                          Dimiliki
                        </span>
                      ) : isPending ? (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      ) : (
                        <span className="text-indigo-400 font-medium">
                          {formatPrice(game.price)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {isOwned ? (
                    <Link
                      href="/dashboard"
                      className="w-full text-center text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg transition"
                    >
                      Lihat Widget →
                    </Link>
                  ) : isPending ? (
                    <button
                      disabled
                      className="w-full text-sm bg-gray-800 opacity-50 cursor-not-allowed px-4 py-2.5 rounded-lg"
                    >
                      Menunggu konfirmasi admin
                    </button>
                  ) : (
                    <Link
                      href={"/dashboard/store/order/" + game.id}
                      className="w-full text-center text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg transition"
                    >
                      {"Beli — " + formatPrice(game.price)}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}