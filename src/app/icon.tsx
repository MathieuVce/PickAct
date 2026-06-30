import { ImageResponse } from "next/og";
import { BrandWheel } from "@/components/BrandMark";

export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14122b",
        }}
      >
        <BrandWheel size={84} />
      </div>
    ),
    { ...size },
  );
}
