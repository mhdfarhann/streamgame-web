import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function OverlayPage({
  params,
}: {
  params: Promise<{ widgetId: string }>
}) {
  const { widgetId } = await params
  const supabase = await createClient()

  const { data: widget } = await supabase
    .from("widgets")
    .select("*, games(slug)")
    .eq("id", widgetId)
    .single()

  if (!widget) redirect("/")

  redirect("/games/" + widget.games?.slug + "/overlay?widgetId=" + widgetId)
}