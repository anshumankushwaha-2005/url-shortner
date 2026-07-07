export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid rgba(99,102,241,0.1)", color: "#6b7a9e", fontSize: "0.8rem" }}
      className="py-8 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }} className="gradient-text">
            Snipify
          </span>
          <span>— shorten, share, analyze.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">API Docs</span>
          <span>© 2026 Snipify Inc.</span>
        </div>
      </div>
    </footer>
  );
}
