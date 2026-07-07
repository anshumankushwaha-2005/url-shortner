import UrlCard from "./UrlCard";

export default function UrlList({ urls, onViewAnalytics, onDelete, emptyMessage = "No links found." }) {
  if (!urls.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <p style={{ color: "#6b7a9e", fontSize: "0.9rem" }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
      {urls.map((u) => (
        <div key={u.id} className="fade-in-up">
          <UrlCard entry={u} onViewAnalytics={onViewAnalytics} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
