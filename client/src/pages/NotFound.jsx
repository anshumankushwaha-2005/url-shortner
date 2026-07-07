import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px" }}>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "4rem", color: "#f0f2ff", margin: 0 }} className="gradient-text">
        404
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", color: "#f0f2ff", marginTop: "8px" }}>
        This link doesn&apos;t exist
      </h1>
      <p style={{ color: "#6b7a9e", fontSize: "0.9rem", marginTop: "8px", maxWidth: "360px" }}>
        The page you&apos;re looking for may have been moved, expired, or never existed.
      </p>
      <Link
        to="/"
        style={{ marginTop: "24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", borderRadius: "10px", padding: "12px 28px", textDecoration: "none" }}
      >
        Back to home
      </Link>
    </div>
  );
}
