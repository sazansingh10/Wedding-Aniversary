import { ImageResponse } from "next/og";

export const alt = "Two Years. One Forever.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share image for link previews. Intentionally contains no photographs or
 * personal details: a link preview can travel further than the link itself.
 */
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
        background: "radial-gradient(60% 60% at 50% 40%, #3a111f, #160509)",
        color: "#fbf7f0",
        fontFamily: "serif",
      }}
    >
      <div
        style={{ fontSize: 22, letterSpacing: 10, color: "#e3cfa4", textTransform: "uppercase" }}
      >
        21 · XI · MMXXVI
      </div>
      <div style={{ fontSize: 96, marginTop: 30, fontWeight: 300 }}>Two years.</div>
      <div style={{ fontSize: 96, fontStyle: "italic", color: "#e3cfa4" }}>One forever.</div>
    </div>,
    size,
  );
}
