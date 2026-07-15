import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          background: "#000000",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 700,
            fontFamily: "Arial, Helvetica, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          $x
        </span>
      </div>
    ),
    { ...size }
  );
}
