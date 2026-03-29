"use client"
import { useState } from "react"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}