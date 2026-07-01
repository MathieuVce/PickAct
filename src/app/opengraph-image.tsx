import { ImageResponse } from "next/og";
import { BrandWheel } from "@/components/BrandMark";

export const alt = "PickAct, choisir une activité au hasard entre amis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        padding: 80,
        background: "linear-gradient(135deg, #1b1640 0%, #14122b 55%, #2a1648 100%)",
        color: "#f4f2ff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <BrandWheel size={150} />
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: -2,
            backgroundImage: "linear-gradient(120deg, #8b5cf6, #f472b6, #22d3ee)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          PickAct
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 40,
          lineHeight: 1.35,
          color: "#b0aada",
          maxWidth: 940,
          textAlign: "center",
        }}
      >
        Une activité tirée au hasard entre amis, selon votre temps, votre budget et votre
        mode de transport.
      </div>
    </div>,
    { ...size },
  );
}
