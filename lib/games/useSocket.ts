"use client"
import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

type GameEvent = {
  type: string
  result: string        // ← hapus ? supaya tidak undefined
  [key: string]: any
}

export function useSocket(
  widgetId: string,
  onEvent: (event: GameEvent) => void
) {
  const socketRef = useRef<Socket | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { widgetId },
      transports: ["websocket"],
    })
    socketRef.current = socket

    socket.on("game_event", (e) => onEventRef.current(e))
    socket.on("state", (e) => onEventRef.current(e))

    return () => {
      socket.disconnect()
    }
  }, [widgetId])

  return socketRef
}