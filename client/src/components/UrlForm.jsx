import { useState } from "react";
import { urlApi } from "../services/api";
import Loader from "./Loader";

export default function UrlForm({ onAdd }) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isValid = url.startsWith("http://") || url.startsWith("https://");

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please enter a valid URL starting with https://");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await urlApi.create({ originalUrl: url, customCode: customCode || undefined });
      onAdd(res.data.url);
      setUrl("");
      setCustomCode("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not shorten that URL. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      className="p-6"
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
    >
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div className="relative flex-1" style={{ minWidth: "260px" }}>
          <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b7a9e" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M6.5 9.5l3-3M7 4.5l1.5-1.5a3 3 0 014.243 4.243L11 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M9 11.5l-1.5 1.5a3 3 0 01-4.243-4.243L5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="Paste your long URL here..."
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(99,102,241,0.2)"}`,
              borderRadius: "10px",
              padding: "12px 14px 12px 40px",
              color: "#f0f2ff",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !url}
          style={{
            background: loading || !url ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderRadius: "10px",
            padding: "12px 24px",
            cursor: loading || !url ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "140px",
            justifyContent: "center",
            border: "none",
          }}
        >
          {loading ? (<><Loader size={14} inline /> Shortening...</>) : success ? "Done!" : "Shorten URL"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "8px", fontFamily: "var(--font-mono)" }}>{error}</p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ color: "#6b7a9e", fontSize: "0.8rem", background: "none", border: "none" }}
          className="hover:text-indigo-400"
        >
          Advanced options
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-3 fade-in-up">
          <label style={{ fontSize: "0.75rem", color: "#6b7a9e", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Custom alias
          </label>
          <div className="flex items-center gap-2 mt-1.5">
            <span style={{ color: "#6b7a9e", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>snip.ly/</span>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
              placeholder="my-custom-link"
              maxLength={20}
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#f0f2ff",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono)",
                outline: "none",
                width: "200px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
