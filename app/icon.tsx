import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, #47b6e8 0%, #16394a 38%, #0a1015 100%)",
          color: "#f4f7fb",
          fontSize: 238,
          fontWeight: 700,
          letterSpacing: "-0.08em",
          borderRadius: 120,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            borderRadius: 92,
            border: "2px solid rgba(255,255,255,0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 999,
            background: "rgba(71, 182, 232, 0.18)",
            filter: "blur(8px)",
            top: -36,
            right: -28,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transform: "translateY(-4px)",
          }}
        >
          <span>E</span>
          <span style={{ color: "#47b6e8" }}>P</span>
        </div>
      </div>
    ),
    size,
  );
}
