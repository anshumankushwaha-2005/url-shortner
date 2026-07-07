export default function Loader({ size = 16, inline = false }) {
  const spinner = (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: "2px solid rgba(255,255,255,0.25)",
        borderTopColor: "currentColor",
        borderRadius: "50%",
        display: "inline-block",
      }}
      className="spin"
    />
  );

  if (inline) return spinner;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
      {spinner}
    </div>
  );
}
