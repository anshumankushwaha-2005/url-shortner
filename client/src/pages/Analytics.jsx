import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnalyticsCard, { StatCard } from "../components/AnalyticsCard";
import Loader from "../components/Loader";
import { urlApi, analyticsApi } from "../services/api";

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const [urls, setUrls] = useState([]);
  const [activeId, setActiveId] = useState(selectedId);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    urlApi.list().then((res) => {
      setUrls(res.data.urls);
      const initial = selectedId || res.data.urls[0]?.id;
      setActiveId(initial);
    });
  }, [selectedId]);

  useEffect(() => {
    if (!activeId) return;
    setLoading(true);
    analyticsApi
      .forUrl(activeId)
      .then((res) => setEntry(res.data.analytics))
      .finally(() => setLoading(false));
  }, [activeId]);

  if (loading || !entry) return <Loader />;

  const maxDay = Math.max(...entry.dailyClicks.map((d) => d.clicks), 1);
  const weekClicks = entry.dailyClicks.reduce((a, d) => a + d.clicks, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#6b7a9e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Analytics</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "#f0f2ff", letterSpacing: "-0.02em" }}>Link Performance</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" }}>
        <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#6b7a9e", textTransform: "uppercase" }}>Your Links</p>
          </div>
          {urls.map((u) => (
            <button
              key={u.id}
              onClick={() => setActiveId(u.id)}
              style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.07)", background: activeId === u.id ? "rgba(99,102,241,0.1)" : "transparent", borderLeft: `3px solid ${activeId === u.id ? "#6366f1" : "transparent"}` }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: activeId === u.id ? "#a5b4fc" : "#e8ecff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.title}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#6b7a9e" }}>{u.shortCode}</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", color: activeId === u.id ? "#818cf8" : "#94a3c8" }}>{u.clicks.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <StatCard label="Total Clicks" value={entry.clicks.toLocaleString()} sub="All time" />
            <StatCard label="This Week" value={weekClicks.toLocaleString()} sub={`${entry.dailyClicks.length} days`} />
            <StatCard label="Last Click" value={entry.lastClick} sub="Most recent" />
          </div>

          <div style={{ backgroundColor: "var(--card)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#e8ecff" }}>Daily Clicks</p>
                <p style={{ fontSize: "0.75rem", color: "#6b7a9e", marginTop: "2px" }}>Last 7 days</p>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#818cf8", background: "rgba(99,102,241,0.1)", padding: "4px 10px", borderRadius: "6px" }}>snip.ly/{entry.shortCode}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "140px" }}>
              {entry.dailyClicks.map((d, i) => {
                const pct = d.clicks / maxDay;
                const isLast = i === entry.dailyClicks.length - 1;
                return (
                  <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%" }}>
                      <div style={{ width: "100%", height: `${Math.max(pct * 100, 4)}%`, background: isLast ? "linear-gradient(180deg, #6366f1, #8b5cf6)" : "rgba(99,102,241,0.25)", borderRadius: "6px 6px 2px 2px" }} />
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "#4b5672", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{d.date}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <AnalyticsCard title="Top Referrers">
              {entry.referrers.map((r, i) => {
                const max = entry.referrers[0]?.count || 1;
                return (
                  <div key={r.source} className="mb-3 last:mb-0">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#e8ecff" }}>{r.source}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#818cf8" }}>{r.count.toLocaleString()}</span>
                    </div>
                    <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(99,102,241,0.1)" }}>
                      <div style={{ height: "100%", width: `${(r.count / max) * 100}%`, background: `hsl(${245 - i * 15}, 70%, 60%)`, borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </AnalyticsCard>

            <AnalyticsCard title="Devices">
              {entry.devices.map((d) => (
                <div key={d.device} className="mb-3 last:mb-0">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#e8ecff" }}>{d.device}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#818cf8" }}>{d.pct}%</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(99,102,241,0.1)" }}>
                    <div style={{ height: "100%", width: `${d.pct}%`, background: "#6366f1", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </AnalyticsCard>
          </div>

          <AnalyticsCard title="Top Countries">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {entry.countries.map((c, i) => (
                <div key={c.country} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", background: i === 0 ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "1.3rem" }}>{c.flag}</span>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "#e8ecff", fontWeight: 500 }}>{c.country}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#6b7a9e" }}>{c.count.toLocaleString()} clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}
