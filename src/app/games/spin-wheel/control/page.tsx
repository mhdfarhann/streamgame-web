import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SpinWheelControl from "./SpinWheelControl"

export default async function SpinWheelControlPage({
  searchParams,
}: {
  searchParams: Promise<{ widgetId: string }>
}) {
  const { widgetId } = await searchParams

  if (!widgetId) redirect("/dashboard")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: widget } = await supabase
    .from("widgets")
    .select("name, config")
    .eq("id", widgetId)
    .eq("user_id", user.id)
    .single()

  if (!widget) redirect("/dashboard")

  return (
    <SpinWheelControl
      widgetId={widgetId}
      widgetName={widget.name}
      config={widget.config ?? {}}
    />
  )
}