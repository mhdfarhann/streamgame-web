"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function OrderClient({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = async () => {
    if (!file || !orderId) return
    setUploading(true)

    const supabase = createClient()

    // Upload ke Supabase Storage
    const ext = file.name.split(".").pop()
    const path = `proofs/${orderId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      alert("Gagal upload: " + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(path)

    // Simpan URL ke tabel orders
    await supabase
      .from("orders")
      .update({ proof_url: urlData.publicUrl })
      .eq("id", orderId)

    setUploaded(true)
    setUploading(false)
  }

  if (uploaded) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center space-y-2">
        <p className="text-green-400 font-medium">Bukti berhasil dikirim!</p>
        <p className="text-gray-400 text-sm">
          Admin akan mengkonfirmasi pembayaran kamu. Kamu akan bisa menggunakan game setelah dikonfirmasi.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <p className="text-sm font-medium">Upload bukti pembayaran (opsional)</p>
      <p className="text-xs text-gray-500">
        Mempercepat proses konfirmasi. Format: JPG, PNG, max 2MB.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:text-sm cursor-pointer"
      />

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