import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Pakai service role agar bisa diakses tanpa login (untuk OBS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const widgetId = searchParams.get("widgetId")

  if (!widgetId) {
    return NextResponse.json({ error: "widgetId required" }, { status: 400 })
  }

  const { data: widget } = await supabaseAdmin
    .from("widgets")
    .select("config")
    .eq("id", widgetId)
    .single()

  if (!widget) {
    return NextResponse.json({ error: "Widget not found" }, { status: 404 })
  }

  return NextResponse.json(widget.config ?? {})
}