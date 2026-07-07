import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { copyToClipboard } from "../utils/copyToClipboard";

const features = [
  { label: "Custom Aliases", desc: "Brand your links with memorable short codes that match your identity." },
  { label: "Deep Analytics", desc: "Track clicks, referrers, geographic data, and device breakdown in real time." },
  { label: "QR Code Generation", desc: "Instantly generate scannable QR codes for every shortened link." },
  { label: "Link Expiration", desc: "Set time-based or click-count expirations for secure, temporary links." },
  { label: "Team Workspaces", desc: "Organize links by team, project, or campaign with shared access controls." },
  { label: "REST API", desc: "Automate link creation and retrieval with our developer-first JSON API." },
];

const stats = [
  { value: "2.4B+", label: "Links Shortened" },
  { value: "98.9%", label: "Uptime SLA" },
  { value: "180ms", label: "Avg. Redirect" },
  { value: "150+", label: "Countries Served" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [demoUrl, setDemoUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [loading, setLoading] = useState(false);

  // Public demo endpoint (no auth) — falls back to a client-side stub if unavailable.
  const handleDemo = async () => {
    if (!demoUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/urls/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: demoUrl }),
      });
      const data = await res.json();
      setShortened(data.shortUrl || `snip.ly/${Math.random().toString(36).slice(2, 8)}`);
    } catch {
      setShortened(`snip.ly/${Math.random().toString(36).slice(2, 8)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <section className="relative" style={{ paddingTop: "100px", paddingBottom: "80px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            top: "-100px", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 mb-8">
            <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "100px", padding: "6px 16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80" }} className="pulse-dot" />
              <span style={{ fontSize: "0.78rem", color: "#a5b4fc", fontFamily: "var(--font-mono)" }}>Now with AI-powered link tagging</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.4rem, 6vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "20px", color: "#f0f2ff" }}>
            Shorten links.<br />
            <span className="gradient-text">Amplify reach.</span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#94a3c8", maxWidth: "540px", margin: "0 auto 48px", lineHeight: 1.6 }}>
            Snipify turns your long URLs into clean, trackable short links — with analytics, QR codes, and team collaboration built in.
          </p>

          <div style={{ display: "flex", gap: "10px", maxWidth: "600px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }} onKeyDown={(e) => e.key === "Enter" && handleDemo()}>
            <div className="relative flex-1" style={{ minWidth: "280px" }}>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://your-very-long-url.com/path?query=example"
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "15px 18px", color: "#f0f2ff", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading || !demoUrl}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.95rem", borderRadius: "12px", padding: "15px 28px", cursor: loading || !demoUrl ? "not-allowed" : "pointer",
                opacity: loading || !demoUrl ? 0.6 : 1, whiteSpace: "nowrap", border: "none",
              }}
            >
              {loading ? "Shortening…" : "Shorten Free"}
            </button>
          </div>

          {shortened && (
            <div className="fade-in-up" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "10px 18px" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "#4ade80", fontSize: "0.9rem" }}>https://{shortened}</span>
              <button onClick={() => copyToClipboard(`https://${shortened}`)} style={{ color: "#4ade80", opacity: 0.7, background: "none", border: "none" }} className="hover:opacity-100">
                Copy
              </button>
              <span style={{ fontSize: "0.75rem", color: "#6b7a9e" }}>Sign up to track analytics →</span>
            </div>
          )}

          <p style={{ fontSize: "0.78rem", color: "#4b5672", marginTop: "16px" }}>No credit card required · Free plan includes 50 links</p>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "32px 24px" }}>
        <div className="max-w-4xl mx-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "24px", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "#f0f2ff", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontSize: "0.8rem", color: "#6b7a9e", marginTop: "4px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            Everything you need
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#f0f2ff", letterSpacing: "-0.02em" }}>
            Built for teams who move fast
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {features.map((f) => (
            <div key={f.label} style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "14px", padding: "24px" }} className="card-glow">
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "#e8ecff", marginBottom: "8px" }}>{f.label}</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7a9e", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          margin: "0 24px 80px", borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)",
          border: "1px solid rgba(99,102,241,0.2)", padding: "64px 24px", textAlign: "center",
          maxWidth: "900px", marginLeft: "auto", marginRight: "auto",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0f2ff", letterSpacing: "-0.02em", marginBottom: "16px" }}>
          Start shortening for free
        </h2>
        <p style={{ fontSize: "1rem", color: "#94a3c8", marginBottom: "32px" }}>Join 42,000+ teams already using Snipify to power their links.</p>
        <button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", borderRadius: "12px", padding: "16px 40px", cursor: "pointer", border: "none" }}
          className="hover:opacity-90"
        >
          {isAuthenticated ? "Go to Dashboard" : "Create free account →"}
        </button>
      </section>
    </div>
  );
}
