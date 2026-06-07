import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            🐝
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#78350f" }}>
            DigitalHive
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            color: "#1c1917",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Discover Premium Digital Products
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#92400e" }}>
          The marketplace for digital creators
        </div>
      </div>
    ),
    { ...size },
  );
}
