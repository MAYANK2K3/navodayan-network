import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 92,
          background: "linear-gradient(135deg, #1E3A8A 0%, #0B132B 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F59E0B",
          borderRadius: "40px",
          fontWeight: 900,
          fontFamily: "serif",
          border: "4px solid rgba(245, 158, 11, 0.4)",
        }}
      >
        JN
      </div>
    ),
    {
      ...size,
    }
  );
}
