import { NextResponse } from "next/server";

// Newsletter subscription endpoint. In production, forward `email` to your
// email provider (Mailchimp, ConvertKit, Klaviyo, Resend Audiences, etc.).
export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 },
      );
    }

    // TODO: integrate with your email service provider here.
    // e.g. await fetch("https://api.your-esp.com/subscribe", { ... })
    console.log(`[newsletter] new subscriber: ${email} (source: ${source})`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}
