"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Widget = {
  id: string
  name: string
  config: {
    items?: string[]
    theme?: string
  }
}

export default function WidgetSettings({ widget }: { widget: Widget }) {
  const [name, setName] = useState(widget.name)
  const [items, setItems] = useState<string[]>(widget.config?.items ?? [])
  const [newItem, setNewItem] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const addItem = () => {
    if (!newItem.trim()) return
    setItems((prev) => [...prev, newItem.trim()])
    setNewItem("")
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    await supabase
      .from("widgets")
      .update({
        name,
        config: { ...widget.config, items },
      })
      .eq("id", widget.id)

    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Nama widget */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <p className="text-sm font-medium">Nama Widget</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Daftar item */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <p className="text-sm font-medium">
          Daftar Item Spin Wheel
          <span className="ml-2 text-xs text-gray-500">{items.length} item</span>
        </p>

        {/* List item */}
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada item. Tambahkan di bawah.</p>
          )}
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                {item}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-300 text-sm px-2 py-2 rounded-lg hover:bg-red-500/10 transition"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        {/* Tambah item */}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Nama hadiah / item..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={addItem}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Tombol simpan */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl text-sm font-medium transition"
      >
        {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Pengaturan"}
      </button>
    </div>
  )
}