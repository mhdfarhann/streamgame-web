// app/admin/AdminClient.tsx - VERSI AMAN
"use client"
import { useState } from "react"

type Order = {
  id: string
  status: string
  amount: number
  created_at: string
  proof_url: string | null
  users: { email: string; name: string } | null
  games: { name: string; slug: string } | null
  user_id: string
  game_id: string
}

export default function AdminClient({ orders }: { orders: Order[] }) {
  const [list, setList] = useState<Order[]>(orders)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleAction = async (orderId: string, action: "confirm" | "reject") => {
    setLoadingId(orderId)

    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action }),
    })

    const { error } = await res.json()

    if (error) {
      alert("Gagal: " + error)
      setLoadingId(null)
      return
    }

    const newStatus = action === "confirm" ? "confirmed" : "rejected"
    setList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    setLoadingId(null)
  }

  const statusBadge = (status: string) => {
    if (status === "pending") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    if (status === "confirmed") return "bg-green-500/20 text-green-400 border-green-500/30"
    if (status === "rejected") return "bg-red-500/20 text-red-400 border-red-500/30"
    return ""
  }

  if (list.length === 0) {
    return <p className="text-gray-400 text-sm">Belum ada order.</p>
  }

  return (
    <div className="space-y-3">
      {list.map((order) => (
        <div
          key={order.id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium">
                {order.users?.name ?? order.users?.email}
              </p>
              <span className={"text-xs border px-2 py-0.5 rounded-full " + statusBadge(order.status)}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {order.games?.name} — {formatPrice(order.amount)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(order.created_at)}
            </p>
            {order.proof_url && (
              <a
                href={order.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:underline"
              >
                Lihat bukti bayar
              </a>
            )}
          </div>

          {order.status === "pending" && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(order.id, "confirm")}
                disabled={loadingId === order.id}
                className="text-sm bg-green-600 hover:bg-green-500 disabled:opacity-50 px-4 py-2 rounded-lg transition"
              >
                {loadingId === order.id ? "..." : "Konfirmasi"}
              </button>
              <button
                onClick={() => handleAction(order.id, "reject")}
                disabled={loadingId === order.id}
                className="text-sm bg-red-600/30 hover:bg-red-600/50 disabled:opacity-50 px-4 py-2 rounded-lg transition"
              >
                Tolak
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}