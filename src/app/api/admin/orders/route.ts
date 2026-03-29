import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  // Cek session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Cek role admin
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userData?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { orderId, action } = await req.json()

  if (!orderId || !["confirm", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Pakai service role untuk bypass RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Ambil data order
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*, games(slug)")
    .eq("id", orderId)
    .eq("status", "pending")
    .single()

  if (!order) {
    return NextResponse.json(
      { error: "Order tidak ditemukan atau sudah diproses" },
      { status: 404 }
    )
  }

  if (action === "reject") {
    await supabaseAdmin
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", orderId)

    return NextResponse.json({ ok: true })
  }

  // action === "confirm"
  // 1. Update status order
  await supabaseAdmin
    .from("orders")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  // 2. Tambah ke purchases
  await supabaseAdmin.from("purchases").upsert(
    {
      user_id: order.user_id,
      game_id: order.game_id,
      amount_paid: order.amount,
      order_id: order.id,
    },
    { onConflict: "order_id" }
  )

  // 3. Buat widget otomatis kalau belum ada
  const { data: existingWidget } = await supabaseAdmin
    .from("widgets")
    .select("id")
    .eq("user_id", order.user_id)
    .eq("game_id", order.game_id)
    .single()

  if (!existingWidget) {
    await supabaseAdmin.from("widgets").insert({
      user_id: order.user_id,
      game_id: order.game_id,
      name: "Widget " + order.games?.slug,
      config: { items: [], theme: "dark" },
    })
  }

  return NextResponse.json({ ok: true })
}
