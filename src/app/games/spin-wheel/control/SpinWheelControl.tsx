"use client"
import { useState } from "react"
import { sendAction } from "@/lib/games/sendAction"
import type { ControlProps } from "@/lib/games/types"

export default function SpinWheelControl({ widgetId, widgetName, config }: ControlProps) {
  const [spinning, setSpinning] = useState(false)
  const [lastResult, setLastResult] = useState("")
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState("")

  const items: string[] = config?.items ?? []

  const showStatus = (msg: string) => {
    setStatus(msg)
    setTimeout(() => setStatus(""), 2000)
  }

  const handleSpin = async () => {
    if (spinning) return
    if (items.length === 0) {
      showStatus("Tambahkan item dulu di pengaturan widget!")
      return
    }

    setSpinning(true)
    setVisible(true)
    showStatus("Spinning...")

    const data = await sendAction(widgetId, "spin", { items })

    if (data.ok) {
      setLastResult(data.result)
      showStatus("Hasil: " + data.result)
    } else {
      showStatus("Error: " + data.error)
    }

    setTimeout(() => setSpinning(false), 4500)
  }

  const handleReset = async () => {
    await sendAction(widgetId, "reset")
    setLastResult("")
    showStatus("Reset!")
  }

  const handleShow = async () => {
    await sendAction(widgetId, "show")
    setVisible(true)
    showStatus("Overlay ditampilkan")
  }

  const handleHide = async () => {
    await sendAction(widgetId, "hide")
    setVisible(false)
    showStatus("Overlay disembunyikan")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Control Panel
          </p>
          <p className="font-semibold">{widgetName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={"w-2 h-2 rounded-full " + (visible ? "bg-green-400" : "bg-gray-600")} />
          <span className="text-xs text-gray-400">
            {visible ? "Overlay aktif" : "Overlay hidden"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 space-y-4 max-w-sm mx-auto w-full">

        {/* Tombol SPIN */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full h-32 text-3xl font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl transition shadow-lg"
        >
          {spinning ? "SPINNING..." : "SPIN"}
        </button>

        {/* Tombol sekunder */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            onClick={handleShow}
            className="py-4 text-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl transition"
          >
            Tampilkan
          </button>
          <button
            onClick={handleReset}
            className="py-4 text-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl transition"
          >
            Reset
          </button>
          <button
            onClick={handleHide}
            className="py-4 text-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl transition"
          >
            Sembunyikan
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-center">
            <p className="text-sm text-gray-300">{status}</p>
          </div>
        )}

        {/* Hasil terakhir */}
        {lastResult && (
          <div className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Hasil terakhir</p>
            <p className="text-xl font-bold text-indigo-300">{lastResult}</p>
          </div>
        )}

        {/* Daftar item */}
        <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Item ({items.length})
          </p>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada item.{" "}
              <a href="/dashboard" className="text-indigo-400 hover:underline">
                Tambah di pengaturan →
              </a>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}