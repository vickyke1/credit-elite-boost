const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const r = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (r.length >= 8) return true;
  r.push(now);
  hits.set(ip, r);
  return false;
};

interface Candidate { id: string; bank: string; limit: number; ageYears: number; price: number; firstReporting: string; status: string }

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "picks"],
  properties: {
    summary: { type: "string" },
    picks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "reason"],
        properties: { id: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);

  let body: { goal?: unknown; candidates?: unknown };
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const goal = typeof body.goal === "string" ? body.goal.replace(/[<>]/g, "").trim().slice(0, 800) : "";
  if (goal.length < 10) return json({ error: "Please describe your goal in a bit more detail." }, 400);
  const candidates = (Array.isArray(body.candidates) ? body.candidates : []).slice(0, 80).filter(
    (c): c is Candidate => c && typeof c.id === "string" && typeof c.price === "number" && typeof c.limit === "number",
  ).map((c) => ({ id: c.id.slice(0, 12), bank: String(c.bank).slice(0, 60), limit: c.limit, ageYears: Number(c.ageYears), price: c.price, firstReporting: String(c.firstReporting).slice(0, 40), status: String(c.status).slice(0, 12) }));
  if (!candidates.length) return json({ error: "No tradelines available to recommend." }, 400);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI is not configured." }, 500);

  const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    signal: req.signal,
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      instructions:
        "You are an educational tradeline shopping assistant. From the provided inventory only, pick 3 to 5 tradelines that best fit the shopper's goal and budget. Explain each pick in one short sentence referencing limit, age, price or reporting timing. Never promise score increases or approvals. Use only ids from the inventory. The summary is 1-2 sentences.",
      input: [{ role: "user", content: `Goal: ${goal}\n\nInventory:\n${JSON.stringify(candidates)}` }],
      text: { format: { type: "json_schema", name: "recommendations", strict: true, schema } },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text().catch(() => "");
    let msg = "The assistant is unavailable right now. Please try again later.";
    try { msg = JSON.parse(t)?.error?.message ?? JSON.parse(t)?.message ?? msg; } catch { /* keep default */ }
    if (upstream.status === 429) msg = "The assistant is busy. Please try again in a minute.";
    return json({ error: msg }, upstream.status);
  }

  const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "", text = "", failed = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const l of lines) {
      if (!l.startsWith("data:")) continue;
      const d = l.slice(5).trim();
      if (!d || d === "[DONE]") continue;
      try {
        const e = JSON.parse(d);
        if (e.type === "response.output_text.delta") text += e.delta;
        if (e.type === "response.failed" || e.type === "error") failed = e.response?.error?.message ?? e.message ?? "failed";
      } catch { /* ignore partial */ }
    }
  }
  if (failed || !text) return json({ error: "The assistant couldn't produce recommendations for that request." }, 502);
  try {
    const out = JSON.parse(text);
    const ids = new Set(candidates.map((c) => c.id));
    out.picks = (out.picks ?? []).filter((p: { id: string }) => ids.has(p.id));
    return json(out);
  } catch {
    return json({ error: "The assistant returned an unexpected answer. Please try again." }, 502);
  }
});
