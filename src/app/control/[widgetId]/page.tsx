import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ControlPage({
  params,
}: {
  params: Promise<{ widgetId: string }>
}) {
  const { widgetId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: widget } = await supabase
    .from("widgets")
    .select("*, games(slug)")
    .eq("id", widgetId)
    .eq("user_id", user.id)
    .single()

  if (!widget) redirect("/dashboard")

  redirect("/games/" + widget.games?.slug + "/control?widgetId=" + widgetId)
}