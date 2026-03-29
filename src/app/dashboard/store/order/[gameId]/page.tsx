import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import OrderClient from "./orderClient"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single()

  if (!game) redirect("/dashboard/store")

  // Sudah punya → langsung ke dashboard
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("game_id", game.id)
    .single()

  if (existing) redirect("/dashboard")

  // Cek order pending yang sudah ada, kalau belum ada buat baru
  let order = null
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("game_id", game.id)
    .eq("status", "pending")
    .single()

  if (existingOrder) {
    order = existingOrder
  } else {
    const { data: newOrder } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        game_id: game.id,
        amount: game.price,
      })
      .select()
      .single()
    order = newOrder
  }

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
        <Link href="/dashboard/store" className="text-sm text-gray-400 hover:text-white transition">
          ← Kembali
        </Link>
      </nav>

      <main className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Selesaikan Pembayaran</h1>
          <p className="text-gray-400 text-sm mt-1">
            Scan QRIS di bawah untuk membayar
          </p>
        </div>

        {/* Detail order */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Game</span>
            <span>{game.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="text-indigo-400 font-medium">{formatPrice(game.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order ID</span>
            <span className="font-mono text-xs text-gray-500">
              {order?.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-400">Scan QRIS berikut:</p>
          <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center p-2">
            <img
              src="/qris.png"
              alt="QRIS StreamGame"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">StreamGame</p>
            <p className="text-xs text-gray-400">
              Bayar tepat {formatPrice(game.price)} agar mudah dikonfirmasi
            </p>
          </div>
        </div>

        {/* Instruksi */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">Cara bayar:</p>
          <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside leading-relaxed">
            <li>Buka aplikasi mobile banking atau e-wallet kamu</li>
            <li>Pilih menu Scan QR / QRIS</li>
            <li>Scan QR di atas dan bayar {formatPrice(game.price)}</li>
            <li>Upload bukti pembayaran di bawah</li>
            <li>Tunggu konfirmasi admin (biasanya kurang dari 1 jam)</li>
          </ol>
        </div>

        {/* Upload bukti */}
        <OrderClient orderId={order?.id ?? ""} />
      </main>
    </div>
  )
}