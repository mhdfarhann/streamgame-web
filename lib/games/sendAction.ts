export async function sendAction(
  widgetId: string,
  type: string,
  payload?: Record<string, any>
) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_SOCKET_URL + "/action/" + widgetId,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
    }
  )
  return res.json()
}