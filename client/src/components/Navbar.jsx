import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(8,13,26,0.85)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", borderRadius: "8px" }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M2 8C2 4.686 4.686 2 8 2s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="#fff" strokeWidth="1.5" />
              <path d="M5 8h6M8 5l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }} className="gradient-text">
            Snipify
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" active={isActive("/dashboard")}>Dashboard</NavLink>
              <NavLink to="/analytics" active={isActive("/analytics")}>Analytics</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2.5 group">
                <div
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 600 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                >
                  {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <span style={{ color: "#94a3c8", fontSize: "0.875rem" }} className="hidden md:block group-hover:text-white">
                  {user?.name}
                </span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "10px",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                    minWidth: "200px",
                    right: 0,
                    top: "calc(100% + 8px)",
                  }}
                  className="absolute"
                >
                  <div style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }} className="p-4">
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", color: "#e8ecff" }}>{user?.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7a9e", marginTop: "2px" }}>{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      style={{ color: "#f87171", fontSize: "0.85rem" }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: "#94a3c8", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }} className="px-4 py-2 hover:text-white">
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  borderRadius: "8px",
                  color: "#fff",
                  textDecoration: "none",
                }}
                className="px-4 py-2 hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ children, active, to }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: "0.875rem",
        fontWeight: 500,
        color: active ? "#a5b4fc" : "#6b7a9e",
        backgroundColor: active ? "rgba(99,102,241,0.1)" : "transparent",
        borderRadius: "8px",
        padding: "6px 14px",
        textDecoration: "none",
      }}
      className={`hover:text-white ${active ? "" : "hover:bg-white/5"}`}
    >
      {children}
    </Link>
  );
}
