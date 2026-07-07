export function StatCard({ label, value, sub }) {
  return (
    <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "20px" }}>
      <p style={{ fontSize: "0.72rem", color: "#6b7a9e", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.6rem", color: "#f0f2ff", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: "0.72rem", color: "#4b5672", marginTop: "4px", fontFamily: "var(--font-mono)" }}>{sub}</p>}
    </div>
  );
}

export default function AnalyticsCard({ title, children }) {
  return (
    <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "20px" }}>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "#e8ecff", marginBottom: "16px" }}>
        {title}
      </p>
      {children}
    </div>
  );
}
