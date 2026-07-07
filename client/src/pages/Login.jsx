import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Both fields are required."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "40px", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div className="text-center mb-8">
            <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "12px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }} />
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", color: "#f0f2ff", letterSpacing: "-0.02em" }}>Welcome back</h1>
            <p style={{ fontSize: "0.85rem", color: "#6b7a9e", marginTop: "6px" }}>Sign in to your Snipify account</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#94a3c8", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", color: "#94a3c8", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7a9e", background: "none", border: "none" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" style={{ fontSize: "0.75rem", color: "#6366f1", background: "none", border: "none" }} className="hover:text-indigo-300">Forgot password?</button>
              </div>
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#6b7a9e" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#818cf8", fontWeight: 500 }} className="hover:text-indigo-300">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "10px",
  padding: "12px 14px",
  color: "#f0f2ff",
  fontSize: "0.9rem",
  outline: "none",
};
