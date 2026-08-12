import { ImageResponse } from "next/og";

export const alt = "VetConnect — Cartilla de veterinarios";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ede9fe, #ffffff)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
            }}
          >
            <span style={{ fontSize: 56 }}>🐾</span>
          </div>
          <span style={{ fontSize: 84, fontWeight: 700, color: "#1e1b2e" }}>
            VetConnect
          </span>
        </div>

        <span style={{ marginTop: 28, fontSize: 32, color: "#5b21b6" }}>
          Cartilla de veterinarios habilitados por el Colegio
        </span>
      </div>
    ),
    { ...size },
  );
}
