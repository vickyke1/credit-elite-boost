import { NextResponse } from "next/server";

// Contact form endpoint. In production, send an email (Resend, SendGrid) or
// store the message in your database / CRM.
export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    // TODO: send the message via your email service.
    console.log(`[contact] ${name} <${email}>: ${subject}\n${message}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}
