import { NextResponse } from "next/server";

// Lightweight server-side event tracking endpoint. The client analytics layer
// can POST events here (e.g. for first-party Etsy outbound-click logging) in
// addition to Google Analytics. Persist to your warehouse/DB as needed.
export async function POST(request: Request) {
  try {
    const event = await request.json();
    console.log("[track]", JSON.stringify(event));
    // TODO: persist to a database or analytics pipeline.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
