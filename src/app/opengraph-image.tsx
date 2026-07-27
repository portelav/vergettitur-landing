import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "linear-gradient(160deg, #16323a 0%, #1f5b62 60%, #3f9a92 100%)",
          color: "#f7f0e2",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e3b667",
            marginBottom: 20,
          }}
        >
          Guia local · Alagoas, Brasil
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
          Adriano Vergetti
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 18,
            textTransform: "uppercase",
            letterSpacing: 3,
            color: "#8fd4cc",
          }}
        >
          Vergetti Turismo
        </div>
      </div>
    ),
    { ...size }
  );
}
