"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function OrderClient({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState("")

  const handleUpload = async () => {
    if (!file || !orderId) return
    setUploading(true)
    setError("")

    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = "proofs/" + orderId + "." + ext

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError("Gagal upload: " + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(path)

    await supabase
      .from("orders")
      .update({ proof_url: urlData.publicUrl })
      .eq("id", orderId)

    setUploaded(true)
    setUploading(false)
  }

  if (uploaded) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center space-y-2">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-green-400 font-medium">Bukti berhasil dikirim!</p>
        <p className="text-gray-400 text-sm">
          Admin akan mengkonfirmasi dalam kurang dari 1 jam. Game akan aktif otomatis setelah dikonfirmasi.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-2 text-sm text-indigo-400 hover:underline"
        >
          Kembali ke dashboard →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium">Upload bukti pembayaran</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Format JPG atau PNG, maksimal 2MB. Mempercepat proses konfirmasi.
        </p>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f && f.size > 2 * 1024 * 1024) {
            setError("File terlalu besar, maksimal 2MB")
            return
          }
          setFile(f ?? null)
          setError("")
        }}
        className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:text-sm cursor-pointer"
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg transition"
      >
        {uploading ? "Mengupload..." : "Kirim Bukti Bayar"}
      </button>
    </div>
  )
}