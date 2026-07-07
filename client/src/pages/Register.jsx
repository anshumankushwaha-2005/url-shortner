import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#f87171", "#fbbf24", "#4ade80"];

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError("All fields are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", top: "5%", right: "20%", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
        <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "40px", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div className="text-center mb-8">
            <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "12px", width: "48px", height: "48px", margin: "0 auto 16px" }} />
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", color: "#f0f2ff", letterSpacing: "-0.02em" }}>Create your account</h1>
            <p style={{ fontSize: "0.85rem", color: "#6b7a9e", marginTop: "6px" }}>Free plan · No credit card · 50 links</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Chen" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" style={inputStyle} />
              {password && (
                <div className="mt-2 fade-in-up">
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl} style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: strength >= lvl ? strengthColor[strength] : "rgba(99,102,241,0.12)" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: strengthColor[strength], marginTop: "4px", fontFamily: "var(--font-mono)" }}>{strengthLabel[strength]} password</p>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "10px 14px", fontSize: "0.8rem", color: "#f87171", fontFamily: "var(--font-mono)" }}>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", borderRadius: "10px", padding: "13px", cursor: loading ? "wait" : "pointer", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none" }}
            >
              {loading && <Loader size={16} inline />}
              {loading ? "Creating account…" : "Create free account"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#6b7a9e" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#818cf8", fontWeight: 500 }} className="hover:text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: "0.75rem", color: "#94a3c8", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "block", marginBottom: "8px" };
const inputStyle = { width: "100%", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px", padding: "12px 14px", color: "#f0f2ff", fontSize: "0.9rem", outline: "none" };
