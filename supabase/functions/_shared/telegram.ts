export async function sendOwnerAlert(text: string): Promise<boolean> {
  const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
  const telegramKey = Deno.env.get("TELEGRAM_API_KEY");
  if (!gatewayKey || !telegramKey) return false;
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": telegramKey, "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: 7086831521, text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error(`Telegram failed [${res.status}]: ${await res.text()}`);
    return res.ok;
  } catch (e) {
    console.error("Telegram failed", e instanceof Error ? e.message : e);
    return false;
  }
}
