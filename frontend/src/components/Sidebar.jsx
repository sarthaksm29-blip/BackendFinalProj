import React from "react";

export default function Sidebar({
  currentPage,
  setPage,
  user,
  onLogout,
  counts = {},
  isMobileOpen,
  setIsMobileOpen,
  socketConnected,
}) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: "📊" },
    { id: "Pipeline", label: "Pipeline", icon: "📋", badge: counts.deals },
    { id: "Leads", label: "Leads", icon: "👥", badge: counts.leads },
    { id: "Deals", label: "Deals", icon: "💰", badge: counts.deals },
    { id: "Contacts", label: "Contacts", icon: "📇", badge: counts.contacts },
    { id: "Reports", label: "Reports", icon: "📈", roleBadge: "Admin/Manager" },
    { id: "Notifications", label: "Live Activity", icon: "⚡" },
  ];

  const handleNavClick = (id) => {
    setPage(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${isMobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="logo">
            Sales<span>Hub</span>
          </div>
          <div className="status-pill" title={socketConnected ? "Real-time Socket Connected" : "Connecting to Socket.IO"}>
            <span className={`status-dot ${socketConnected ? "online" : "offline"}`} />
            <small>{socketConnected ? "Live" : "Offline"}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-button ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {item.roleBadge && user?.role === "sales" && (
                  <span className="nav-badge-lock" title="Manager & Admin only">🔒</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="avatar">
              {getInitials(user?.name)}
            </div>
            <div className="user-details">
              <span className="user-name" title={user?.name || "User"}>
                {user?.name || "Sales Rep"}
              </span>
              <span className={`role-badge role-${user?.role || "sales"}`}>
                {user?.role || "sales"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
            title="Sign out of SalesHub"
          >
            <span className="logout-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
