"use client"
import { useRef, useState, useEffect, useCallback } from "react"
import { useSocket } from "@/lib/games/useSocket"
import type { OverlayProps } from "@/lib/games/types"

export default function SpinWheelOverlay({ widgetId, config }: OverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visible, setVisible] = useState(true)
  const [result, setResult] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [currentItems, setCurrentItems] = useState<string[]>(config?.items ?? [])
  const spinningRef = useRef(false)
  const currentAngleRef = useRef(0)

  const colors = [
    "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
    "#f43f5e", "#f97316", "#eab308", "#22c55e",
    "#14b8a6", "#06b6d4", "#3b82f6", "#d946ef",
  ]

  const drawWheel = useCallback((angle: number, itemList?: string[]) => {
    const canvas = canvasRef.current
    const activeItems = itemList ?? currentItems
    if (!canvas || activeItems.length === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = canvas.width
    const cx = size / 2
    const cy = size / 2
    const radius = cx - 16
    const sliceAngle = (2 * Math.PI) / activeItems.length

    ctx.clearRect(0, 0, size, size)

    activeItems.forEach((item, i) => {
      const startAngle = angle + i * sliceAngle
      const endAngle = startAngle + sliceAngle
      const midAngle = startAngle + sliceAngle / 2

      // Slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.closePath()

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
      const baseColor = colors[i % colors.length]
      grad.addColorStop(0, baseColor + "cc")
      grad.addColorStop(1, baseColor)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = "rgba(255,255,255,0.15)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Teks
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(midAngle)

      const normalizedAngle = ((midAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const isFlipped = normalizedAngle > Math.PI / 2 && normalizedAngle < Math.PI * 1.5

      const textRadius = radius * 0.62
      const fontSize = Math.max(11, Math.min(16, 280 / activeItems.length))
      ctx.font = "bold " + fontSize + "px sans-serif"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.shadowColor = "rgba(0,0,0,0.6)"
      ctx.shadowBlur = 6

      const label = item.length > 12 ? item.slice(0, 12) + "..." : item

      if (isFlipped) {
        ctx.rotate(Math.PI)
        ctx.fillText(label, -textRadius, 0)
      } else {
        ctx.fillText(label, textRadius, 0)
      }

      ctx.restore()
    })

    // Ring luar
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(255,255,255,0.3)"
    ctx.lineWidth = 3
    ctx.stroke()

    // Lingkaran tengah
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 0.18, 0, 2 * Math.PI)
    ctx.fillStyle = "#0f172a"
    ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.5)"
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Titik tengah
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

  }, [currentItems])

  const animateSpin = useCallback((targetResult: string, itemList: string[]) => {
    if (spinningRef.current) return
    spinningRef.current = true
    setShowResult(false)

    const targetIndex = itemList.indexOf(targetResult)
    if (targetIndex === -1) {
      spinningRef.current = false
      return
    }

    const sliceAngle = (2 * Math.PI) / itemList.length

    // Pointer di atas = -Math.PI / 2
    // Kita hitung sudut akhir yang membuat tengah slice targetIndex
    // tepat berada di posisi pointer
    const currentAngle = currentAngleRef.current % (Math.PI * 2)
    const targetFinalAngle = -Math.PI / 2 - targetIndex * sliceAngle - sliceAngle / 2

    // Normalkan agar selalu maju dan minimal 5 putaran penuh
    let delta = targetFinalAngle - currentAngle
    while (delta < Math.PI * 2 * 5) {
      delta += Math.PI * 2
    }

    const duration = 5000
    const startTime = performance.now()
    const startAngle = currentAngleRef.current

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const angle = startAngle + delta * eased

      currentAngleRef.current = angle
      drawWheel(angle, itemList)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        spinningRef.current = false
        setResult(targetResult)
        setShowResult(true)
      }
    }

    requestAnimationFrame(animate)
  }, [drawWheel])

  const fetchLatestConfig = async (): Promise<string[]> => {
    try {
      const res = await fetch("/api/widget-config?widgetId=" + widgetId)
      const data = await res.json()
      if (data.items && Array.isArray(data.items)) {
        setCurrentItems(data.items)
        return data.items
      }
    } catch {
      // fallback ke config lama
    }
    return currentItems
  }

  useEffect(() => {
    drawWheel(currentAngleRef.current)
  }, [drawWheel])

  useSocket(widgetId, async (event) => {
    if (event.type === "spin") {
      setVisible(true)
      setShowResult(false)
      const latestItems = await fetchLatestConfig()
      animateSpin(event.result, latestItems)
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

  return (
    <>
      <style>{`
        body, html {
          background: transparent !important;
          background-color: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>

          {/* Wheel container */}
          <div style={{ position: "relative" }}>

            {/* Glow */}
            <div style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Pointer segitiga di atas */}
            <div style={{
              position: "absolute",
              top: "-18px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "24px solid #ffffff",
              filter: "drop-shadow(0 2px 8px rgba(99,102,241,0.8))",
              zIndex: 10,
            }} />

            <canvas
              ref={canvasRef}
              width={440}
              height={440}
              style={{
                display: "block",
                filter: "drop-shadow(0 0 24px rgba(99,102,241,0.5))",
              }}
            />
          </div>

          {/* Hasil */}
          {showResult && (
            <div style={{
              background: "rgba(15, 23, 42, 0.92)",
              border: "2px solid rgba(99,102,241,0.8)",
              borderRadius: "16px",
              padding: "14px 36px",
              textAlign: "center",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
              animation: "popIn 0.5s ease forwards",
              minWidth: "200px",
            }}>
              <p style={{
                color: "rgba(148,163,184,1)",
                fontSize: "13px",
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}>
                Hasilnya
              </p>
              <p style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "700",
                margin: 0,
                textShadow: "0 0 20px rgba(99,102,241,0.8)",
              }}>
                {result}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}