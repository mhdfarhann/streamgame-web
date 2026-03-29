const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.DASHBOARD_URL || "http://localhost:3010",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Simpan state game per widget di memory
const gameStates = {}

// Overlay konek ke room berdasarkan widgetId
io.on("connection", (socket) => {
  const widgetId = socket.handshake.query.widgetId

  if (!widgetId) {
    socket.disconnect()
    return
  }

  socket.join(widgetId)
  console.log("Connected:", widgetId)

  // Kirim state terakhir ke overlay yang baru konek
  if (gameStates[widgetId]) {
    socket.emit("state", gameStates[widgetId])
  }

  socket.on("disconnect", () => {
    console.log("Disconnected:", widgetId)
  })
})

// Endpoint dipanggil control panel saat streamer pencet tombol
app.post("/action/:widgetId", (req, res) => {
  const { widgetId } = req.params
  const { type, items } = req.body

  if (type === "spin") {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items kosong" })
    }

    // Hitung hasil random di server
    const result = items[Math.floor(Math.random() * items.length)]

    const state = { type: "spin", result, spinning: true }
    gameStates[widgetId] = state

    // Broadcast ke semua overlay di room ini
    io.to(widgetId).emit("game_event", state)

    return res.json({ ok: true, result })
  }

  if (type === "reset") {
    const state = { type: "reset" }
    gameStates[widgetId] = state
    io.to(widgetId).emit("game_event", state)
    return res.json({ ok: true })
  }

  if (type === "show") {
    const state = { type: "show" }
    gameStates[widgetId] = state
    io.to(widgetId).emit("game_event", state)
    return res.json({ ok: true })
  }

  if (type === "hide") {
    const state = { type: "hide" }
    gameStates[widgetId] = state
    io.to(widgetId).emit("game_event", state)
    return res.json({ ok: true })
  }

  res.status(400).json({ error: "Unknown action" })
})

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, rooms: Object.keys(gameStates).length })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log("Socket server running on :" + PORT)
})