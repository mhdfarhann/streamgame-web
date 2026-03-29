//overlay/[widgetId]/SpinWheelOverlay.tsx

"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

type Props = {
  widgetId: string
  items: string[]
}

export default function SpinWheelOverlay({ widgetId, items: initialItems }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const [visible, setVisible] = useState(true)
  const [result, setResult] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [items, setItems] = useState(initialItems)
  const spinningRef = useRef(false)
  const currentAngleRef = useRef(0)

  // Warna per slice
  const colors = [
    "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
    "#f43f5e", "#f97316", "#eab308", "#22c55e",
    "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  ]

  const drawWheel = (angle: number, highlightResult?: string) => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = cx - 10
    const sliceAngle = (2 * Math.PI) / items.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    items.forEach((item, i) => {
      const start = angle + i * sliceAngle
      const end = start + sliceAngle

      // Slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, start, end)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = "rgba(0,0,0,0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + sliceAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold " + Math.min(18, 200 / items.length) + "px sans-serif"
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 4
      ctx.fillText(item.length > 15 ? item.slice(0, 15) + "..." : item, radius - 12, 6)
      ctx.restore()
    })

    // Lingkaran tengah
    ctx.beginPath()
    ctx.arc(cx, cy, 24, 0, 2 * Math.PI)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    // Pointer (segitiga di atas)
    ctx.beginPath()
    ctx.moveTo(cx, 2)
    ctx.lineTo(cx - 14, 30)
    ctx.lineTo(cx + 14, 30)
    ctx.closePath()
    ctx.fillStyle = "#ffffff"
    ctx.fill()
  }

  const animateSpin = (targetResult: string) => {
    if (spinningRef.current) return
    spinningRef.current = true
    setShowResult(false)

    const targetIndex = items.indexOf(targetResult)
    if (targetIndex === -1) {
      spinningRef.current = false
      return
    }

    const sliceAngle = (2 * Math.PI) / items.length
    const totalRotation = Math.PI * 2 * 8 // 8 putaran penuh
    const targetAngle =
      totalRotation -
      (targetIndex * sliceAngle + sliceAngle / 2) -
      currentAngleRef.current % (Math.PI * 2)

    const duration = 4000
    const startTime = performance.now()
    const startAngle = currentAngleRef.current

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const angle = startAngle + targetAngle * eased

      currentAngleRef.current = angle
      drawWheel(angle)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        spinningRef.current = false
        setResult(targetResult)
        setShowResult(true)
      }
    }

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    drawWheel(currentAngleRef.current)
  }, [items])

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { widgetId },
      transports: ["websocket"],
    })
    socketRef.current = socket

    socket.on("game_event", (event) => {
      if (event.type === "spin") {
        setVisible(true)
        setItems(initialItems)
        animateSpin(event.result)
      }
      if (event.type === "reset") {
        setShowResult(false)
        setResult("")
        currentAngleRef.current = 0
        drawWheel(0)
      }
      if (event.type === "show") setVisible(true)
      if (event.type === "hide") {
        setVisible(false)
        setShowResult(false)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [widgetId])



  return (
    <div
      style={{ 
        background: "transparent",
        display: visible ? "flex" : "none"  
    }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Canvas wheel */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.5))" }}
          />
        </div>

        {/* Hasil */}
        {showResult && (
          <div
            className="bg-gray-900/95 border-2 border-indigo-500 rounded-2xl px-8 py-4 text-center"
            style={{ animation: "fadeIn 0.5s ease" }}
          >
            <p className="text-gray-400 text-sm">Hasilnya:</p>
            <p className="text-white text-3xl font-bold mt-1">{result}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}