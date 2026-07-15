import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          padding: "80px",
          background: "#fbfbfa",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#18181b",
            marginBottom: 40,
          }}
        >
          <span style={{ color: "#fbfbfa", fontSize: 40, fontWeight: 700 }}>
            $x
          </span>
        </div>

        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#18181b" }}>
          {SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#6b6b70",
            maxWidth: 880,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
