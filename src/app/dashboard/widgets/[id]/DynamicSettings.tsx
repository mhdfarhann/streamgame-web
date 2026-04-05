"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type SchemaField = {
  key: string
  type: "list" | "text" | "select" | "color" | "number"
  label: string
  options?: string[]
  placeholder?: string
}

type Props = {
  widget: {
    id: string
    name: string
    config: Record<string, any>
  }
  schema: SchemaField[]
}

export default function DynamicSettings({ widget, schema }: Props) {
  const [name, setName] = useState(widget.name)
  const [config, setConfig] = useState<Record<string, any>>(widget.config ?? {})
  const [newValues, setNewValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const addListItem = (key: string) => {
    const val = newValues[key]?.trim()
    if (!val) return
    updateConfig(key, [...(config[key] ?? []), val])
    setNewValues((prev) => ({ ...prev, [key]: "" }))
  }

  const removeListItem = (key: string, index: number) => {
    updateConfig(
      key,
      (config[key] ?? []).filter((_: any, i: number) => i !== index)
    )
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from("widgets")
      .update({ name, config })
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

      {/* Render field dari schema */}
      {schema.map((field) => (
        <div key={field.key} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium">{field.label}</p>

          {/* List field */}
          {field.type === "list" && (
            <div className="space-y-3">
              <div className="space-y-2">
                {(config[field.key] ?? []).length === 0 && (
                  <p className="text-sm text-gray-500">Belum ada item.</p>
                )}
                {(config[field.key] ?? []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                      {item}
                    </span>
                    <button
                      onClick={() => removeListItem(field.key, index)}
                      className="text-red-400 hover:text-red-300 text-sm px-2 py-2 rounded-lg hover:bg-red-500/10 transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newValues[field.key] ?? ""}
                  onChange={(e) =>
                    setNewValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addListItem(field.key)}
                  placeholder={field.placeholder ?? "Tambah item..."}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  onClick={() => addListItem(field.key)}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                >
                  + Tambah
                </button>
              </div>
            </div>
          )}

          {/* Text field */}
          {field.type === "text" && (
            <input
              value={config[field.key] ?? ""}
              onChange={(e) => updateConfig(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          )}

          {/* Select field */}
          {field.type === "select" && (
            <div className="flex gap-2 flex-wrap">
              {field.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateConfig(field.key, opt)}
                  className={
                    "px-4 py-2 rounded-lg text-sm transition " +
                    (config[field.key] === opt
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700")
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Color field */}
          {field.type === "color" && (
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config[field.key] ?? "#6366f1"}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-sm text-gray-400 font-mono">
                {config[field.key] ?? "#6366f1"}
              </span>
            </div>
          )}

          {/* Number field */}
          {field.type === "number" && (
            <input
              type="number"
              value={config[field.key] ?? 0}
              onChange={(e) => updateConfig(field.key, Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          )}
        </div>
      ))}

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