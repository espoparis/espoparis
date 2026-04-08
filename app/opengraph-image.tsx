import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = siteConfig.seo.ogImageAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at top right, rgba(78,175,221,0.28), transparent 30%), linear-gradient(180deg, #11161d 0%, #0b1015 100%)",
          color: "#f7fbff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 24px",
            borderRadius: "999px",
            border: "1px solid rgba(120, 153, 177, 0.35)",
            background: "rgba(255,255,255,0.04)",
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}
        >
          {siteConfig.shortName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "860px" }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.02 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, color: "rgba(247,251,255,0.78)" }}>
            {siteConfig.description}
          </div>
        </div>

        <div style={{ fontSize: 26, color: "rgba(247,251,255,0.72)" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
