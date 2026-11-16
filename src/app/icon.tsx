import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(135deg, #1E3A8A 0%, #0B132B 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F59E0B",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "serif",
          border: "1px solid rgba(245, 158, 11, 0.4)",
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
