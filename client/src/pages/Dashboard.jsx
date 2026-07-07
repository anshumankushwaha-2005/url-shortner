import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { urlApi } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterTag, setFilterTag] = useState(null);

  useEffect(() => {
    urlApi
      .list()
      .then((res) => setUrls(res.data.urls))
      .catch(() => setUrls([]))
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(urls.flatMap((u) => u.tags || [])));

  const filtered = urls
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.title.toLowerCase().includes(q) || u.shortCode?.includes(q) || u.originalUrl.toLowerCase().includes(q);
      const matchTag = !filterTag || u.tags?.includes(filterTag);
      return matchSearch && matchTag;
    })
    .sort((a, b) => (sortBy === "clicks" ? b.clicks - a.clicks : b.id.localeCompare(a.id)));

  const handleAdd = (entry) => setUrls((prev) => [entry, ...prev]);

  const handleDelete = async (id) => {
    const prev = urls;
    setUrls((cur) => cur.filter((u) => u.id !== id));
    try {
      await urlApi.remove(id);
    } catch {
      setUrls(prev); // revert on failure
    }
  };

  const stats = [
    { label: "Total Links", value: urls.length, icon: "🔗" },
    { label: "Total Clicks", value: urls.reduce((a, u) => a + u.clicks, 0).toLocaleString(), icon: "📊" },
    { label: "Active Links", value: urls.filter((u) => u.active).length, icon: "✅" },
    { label: "Avg. Clicks", value: Math.round(urls.reduce((a, u) => a + u.clicks, 0) / Math.max(urls.length, 1)).toLocaleString(), icon: "⚡" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#6b7a9e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Dashboard</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "#f0f2ff", letterSpacing: "-0.02em" }}>
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ color: "#6b7a9e", fontSize: "0.875rem", marginTop: "4px" }}>Here&apos;s what&apos;s happening with your links today.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "20px" }} className="card-glow">
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: "0.75rem", color: "#6b7a9e", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{s.label}</p>
              <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "#f0f2ff", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#e8ecff", marginBottom: "12px" }}>Shorten a new URL</h2>
        <UrlForm onAdd={handleAdd} />
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1" style={{ minWidth: "200px", maxWidth: "360px" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links…"
            style={{ width: "100%", backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "10px", padding: "9px 12px", color: "#e8ecff", fontSize: "0.85rem", outline: "none" }}
          />
        </div>

        <div className="flex items-center gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(filterTag === t ? null : t)}
              style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", padding: "5px 10px", borderRadius: "6px", border: `1px solid ${filterTag === t ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.12)"}`, background: filterTag === t ? "rgba(99,102,241,0.15)" : "transparent", color: filterTag === t ? "#a5b4fc" : "#6b7a9e" }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span style={{ fontSize: "0.75rem", color: "#6b7a9e" }}>Sort:</span>
          {["recent", "clicks"].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{ fontSize: "0.75rem", padding: "5px 12px", borderRadius: "6px", border: `1px solid ${sortBy === s ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.1)"}`, background: sortBy === s ? "rgba(99,102,241,0.1)" : "transparent", color: sortBy === s ? "#a5b4fc" : "#6b7a9e", textTransform: "capitalize" }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <UrlList urls={filtered} onViewAnalytics={(id) => navigate(`/analytics?id=${id}`)} onDelete={handleDelete} emptyMessage="No links found matching your search." />

      {user?.plan === "free" && (
        <div style={{ marginTop: "40px", background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "24px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#e8ecff", marginBottom: "4px" }}>Unlock unlimited links + advanced analytics</p>
            <p style={{ fontSize: "0.82rem", color: "#6b7a9e" }}>You&apos;re on the free plan. Upgrade to Pro for $9/mo and remove all limits.</p>
          </div>
          <button style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", borderRadius: "10px", padding: "10px 24px", border: "none", whiteSpace: "nowrap" }}>
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
