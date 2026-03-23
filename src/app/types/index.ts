// ─── Database Types ────────────────────────────────────────────────────────

export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
}

export type Game = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  preview_url: string | null
  is_active: boolean
  created_at: string
}

export type Purchase = {
  id: string
  user_id: string
  game_id: string
  amount_paid: number
  order_id: string
  paid_at: string
}

export type Widget = {
  id: string
  user_id: string
  game_id: string
  name: string
  config: WidgetConfig
  created_at: string
}

export type Session = {
  id: string
  widget_id: string
  started_at: string
  results: SessionResult[]
}

// ─── Widget Config (per game) ──────────────────────────────────────────────

export type SpinWheelConfig = {
  items: { label: string; color: string; weight?: number }[]
  duration?: number // ms
  sound?: boolean
}

export type CardFlipConfig = {
  deck: "standard" | "custom"
  custom_cards?: { label: string; image_url?: string }[]
}

export type WidgetConfig = SpinWheelConfig | CardFlipConfig | Record<string, unknown>

// ─── Session Results ───────────────────────────────────────────────────────

export type SpinResult = {
  type: "spin"
  result: string
  timestamp: string
}

export type CardFlipResult = {
  type: "card_flip"
  card: string
  guesses: { viewer: string; guess: string }[]
  timestamp: string
}

export type SessionResult = SpinResult | CardFlipResult

// ─── API Payloads ──────────────────────────────────────────────────────────

export type CreatePaymentPayload = {
  game_id: string
}

export type CreatePaymentResponse = {
  order_id: string
  snap_token: string
  redirect_url: string
}

export type ActionPayload = {
  type: "spin" | "flip" | "reset"
  data?: Record<string, unknown>
}

// ─── Joined / View Types ───────────────────────────────────────────────────

export type WidgetWithGame = Widget & {
  game: Game
}

export type PurchaseWithGame = Purchase & {
  game: Game
}

// ─── Midtrans ─────────────────────────────────────────────────────────────

export type MidtransNotification = {
  order_id: string
  transaction_status: "capture" | "settlement" | "pending" | "deny" | "cancel" | "expire"
  fraud_status: "accept" | "challenge" | "deny"
  payment_type: string
  gross_amount: string
  signature_key: string
}