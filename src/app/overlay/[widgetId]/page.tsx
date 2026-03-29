import { createPublicClient } from "@/lib/supabase/public"  // ← ganti import
import SpinWheelOverlay from "./SpinWheelOverlay"

export default async function OverlayPage({
  params,
}: {
  params: Promise<{ widgetId: string }>
}) {
  const { widgetId } = await params
  const supabase = createPublicClient()  // ← pakai public client

  const { data: widget, error } = await supabase
    .from("widgets")
    .select("*, games(slug)")
    .eq("id", widgetId)
    .maybeSingle()

  if (!widget) {
    return (
      <div style={{ color: "red", fontSize: "24px", padding: "20px" }}>
        Widget not found. Error: {error?.message ?? "no widget"}
      </div>
    )
  }

  return (
    <SpinWheelOverlay
      widgetId={widgetId}
      items={widget.config?.items ?? []}
    />
  )
}