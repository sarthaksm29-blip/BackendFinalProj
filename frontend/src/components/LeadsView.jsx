import React, { useState, useMemo } from "react";

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Cold Call",
  "Other",
];

export default function LeadsView({
  leads = [],
  loading = false,
  onOpenNewLead,
  onEditLead,
  onDeleteLead,
  onConvertToDeal,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        lead.name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.company?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;
      const matchesSource =
        sourceFilter === "ALL" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  return (
    <div className="leads-view animate-fade-in">
      {/* Top Filter and Actions Toolbar */}
      <div className="view-toolbar">
        <div className="toolbar-search-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search leads by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} ({leads.filter((l) => l.status === st).length})
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Sources</option>
            {LEAD_SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onOpenNewLead()}
        >
          <span>+ Add Lead</span>
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="panel leads-table-panel">
        <div className="panel-header">
          <div>
            <h3>Lead Records ({filteredLeads.length})</h3>
            <p>Qualified contacts and incoming business prospects</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading leads data...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-panel-notice">
            <p>
              {search || statusFilter !== "ALL" || sourceFilter !== "ALL"
                ? "No leads matched your search or filters."
                : "No leads currently saved in the database."}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (search || statusFilter !== "ALL" || sourceFilter !== "ALL") {
                  setSearch("");
                  setStatusFilter("ALL");
                  setSourceFilter("ALL");
                } else {
                  onOpenNewLead();
                }
              }}
            >
              {search || statusFilter !== "ALL" || sourceFilter !== "ALL"
                ? "Reset Filters"
                : "+ Create First Lead"}
            </button>
          </div>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Contact Info</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <div className="lead-identity-cell">
                        <div className="lead-avatar-bubble">
                          {lead.name?.charAt(0)?.toUpperCase() || "L"}
                        </div>
                        <div>
                          <strong>{lead.name}</strong>
                          {lead.notes && (
                            <div className="lead-notes-preview" title={lead.notes}>
                              💬 {lead.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-links">
                        <a
                          href={`mailto:${lead.email}`}
                          className="contact-link"
                          title="Send Email"
                        >
                          ✉ {lead.email}
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="contact-link"
                          title="Call"
                        >
                          📞 {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span className="company-text">
                        {lead.company || "—"}
                      </span>
                    </td>
                    <td>
                      <span className="source-pill">
                        {lead.source || "Other"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge status-${(lead.status || "New").toLowerCase()}`}
                      >
                        {lead.status || "New"}
                      </span>
                    </td>
                    <td>
                      <div className="row-action-buttons">
                        <button
                          type="button"
                          className="btn btn-accent-ghost btn-sm"
                          title="Create deal from this lead"
                          onClick={() => onConvertToDeal(lead)}
                        >
                          ⚡ Deal
                        </button>
                        <button
                          type="button"
                          className="icon-btn edit-icon-btn"
                          title="Edit lead"
                          onClick={() => onEditLead(lead)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="icon-btn delete-icon-btn"
                          title="Delete lead"
                          onClick={() => onDeleteLead(lead)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
