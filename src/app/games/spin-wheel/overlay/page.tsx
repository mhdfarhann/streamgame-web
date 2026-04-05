import { createClient } from "@/lib/supabase/server"
import SpinWheelOverlay from "./SpinWheelOverlay"

export default async function SpinWheelOverlayPage({
  searchParams,
}: {
  searchParams: Promise<{ widgetId: string }>
}) {
  const { widgetId } = await searchParams

  if (!widgetId) return null

  const supabase = await createClient()
  const { data: widget } = await supabase
    .from("widgets")
    .select("config")
    .eq("id", widgetId)
    .single()

  return (
    <SpinWheelOverlay
      widgetId={widgetId}
      config={widget?.config ?? {}}
    />
  )
}