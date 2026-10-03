import React, { useState, useRef, useEffect } from "react";

export default function Header({
  currentPage,
  user,
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewContact,
  onRefresh,
  loading,
  onToggleMobileSidebar,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageSubtitles = {
    Dashboard: `Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋 Here is your sales snapshot.`,
    Pipeline: "Visual deal stages and pipeline progression",
    Leads: "Track, qualify, and convert potential customers",
    Deals: "Manage active negotiations and closed revenue",
    Contacts: "Customer directory with designations and affiliations",
    Reports: "Executive analytics and pipeline performance metrics",
    Notifications: "Real-time updates, activity log & push notifications",
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <div>
          <h1>{currentPage}</h1>
          <p className="header-subtitle">
            {pageSubtitles[currentPage] || "SalesHub CRM"}
          </p>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="btn btn-ghost refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh CRM data"
        >
          <span className={`refresh-icon ${loading ? "spinning" : ""}`}>🔄</span>
          <span className="refresh-text">Refresh</span>
        </button>

        <div className="quick-add-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>+ Create</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {dropdownOpen && (
            <div className="quick-add-menu animate-fade-in">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenNewLead();
                }}
              >
                <span className="item-icon">👥</span>
                <div>
                  <strong>New Lead</strong>
                  <small>Capture prospective customer</small>
                </div>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenNewDeal();
                }}
              >
                <span className="item-icon">💰</span>
                <div>
                  <strong>New Deal</strong>
                  <small>Add pipeline opportunity</small>
                </div>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenNewContact();
                }}
              >
                <span className="item-icon">📇</span>
                <div>
                  <strong>New Contact</strong>
                  <small>Directory person entry</small>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
