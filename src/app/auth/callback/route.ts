import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Cek role user
      const { data: { user } } = await supabase.auth.getUser()

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user!.id)
        .single()

      // Redirect berdasarkan role
      if (userData?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`)
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
}