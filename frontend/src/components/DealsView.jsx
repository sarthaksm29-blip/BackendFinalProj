import React, { useState, useMemo } from "react";

const DEAL_STAGES = [
  "Prospecting",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export default function DealsView({
  deals = [],
  loading = false,
  onOpenNewDeal,
  onEditDeal,
  onDeleteDeal,
  onUpdateDealStage,
}) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  const formatCurrency = (val) => {
    return "₹" + Number(val || 0).toLocaleString("en-IN");
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        deal.title?.toLowerCase().includes(q) ||
        deal.lead?.name?.toLowerCase().includes(q) ||
        deal.lead?.company?.toLowerCase().includes(q) ||
        String(deal.value).includes(q);

      const matchesStage =
        stageFilter === "ALL" || deal.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [deals, search, stageFilter]);

  const totalValue = useMemo(() => {
    return filteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [filteredDeals]);

  return (
    <div className="deals-view animate-fade-in">
      {/* Top Toolbar */}
      <div className="view-toolbar">
        <div className="toolbar-search-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search deals by title, company, lead..."
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
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Stages ({deals.length})</option>
            {DEAL_STAGES.map((st) => (
              <option key={st} value={st}>
                {st} ({deals.filter((d) => d.stage === st).length})
              </option>
            ))}
          </select>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Card Grid View"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              ☰ Table
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onOpenNewDeal()}
        >
          <span>+ Create Deal</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="deals-summary-banner">
        <div>
          <span>Showing <strong>{filteredDeals.length}</strong> deals</span>
          {stageFilter !== "ALL" && <span> in <strong>{stageFilter}</strong></span>}
        </div>
        <div>
          <span>Filter Pipeline Value: </span>
          <strong className="summary-value">{formatCurrency(totalValue)}</strong>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading deals...</div>
      ) : filteredDeals.length === 0 ? (
        <div className="panel empty-panel-notice">
          <p>
            {search || stageFilter !== "ALL"
              ? "No deals matched your search or stage filter."
              : "No deals registered yet."}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (search || stageFilter !== "ALL") {
                setSearch("");
                setStageFilter("ALL");
              } else {
                onOpenNewDeal();
              }
            }}
          >
            {search || stageFilter !== "ALL" ? "Reset Filters" : "+ Create First Deal"}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="deal-grid">
          {filteredDeals.map((deal) => (
            <div className="deal-card animate-fade-in" key={deal._id}>
              <div className="deal-top">
                <div className="deal-title-section">
                  <h3 onClick={() => onEditDeal(deal)} title="Click to edit">
                    {deal.title}
                  </h3>
                  <div className="deal-lead-subtitle">
                    👤 {deal.lead?.name || "Unassigned"}
                    {deal.lead?.company && ` • ${deal.lead.company}`}
                  </div>
                </div>

                <div className="deal-card-header-actions">
                  <span className={`badge badge-${deal.stage.toLowerCase()}`}>
                    {deal.stage}
                  </span>
                  <button
                    type="button"
                    className="icon-btn edit-icon-btn"
                    title="Edit deal"
                    onClick={() => onEditDeal(deal)}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-icon-btn"
                    title="Delete deal"
                    onClick={() => onDeleteDeal(deal)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="deal-value">{formatCurrency(deal.value)}</p>

              {deal.expectedCloseDate && (
                <div className="deal-meta-date">
                  <span>Target Close:</span>{" "}
                  <strong>{new Date(deal.expectedCloseDate).toLocaleDateString()}</strong>
                </div>
              )}

              {deal.notes && (
                <div className="deal-notes-box">
                  <small>💬 {deal.notes}</small>
                </div>
              )}

              <div className="deal-footer-controls">
                <label className="stage-switch-label">Move stage:</label>
                <select
                  value={deal.stage}
                  onChange={(e) => onUpdateDealStage(deal._id, e.target.value)}
                  className="deal-stage-quick-select"
                >
                  {DEAL_STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="panel custom-table-panel">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Deal Title</th>
                  <th>Value</th>
                  <th>Lead / Company</th>
                  <th>Stage</th>
                  <th>Target Close</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr key={deal._id}>
                    <td>
                      <strong>{deal.title}</strong>
                      {deal.notes && (
                        <div className="cell-subtext">{deal.notes}</div>
                      )}
                    </td>
                    <td className="deal-value-cell">
                      {formatCurrency(deal.value)}
                    </td>
                    <td>
                      <div>{deal.lead?.name || "—"}</div>
                      <small className="cell-subtext">
                        {deal.lead?.company || ""}
                      </small>
                    </td>
                    <td>
                      <select
                        value={deal.stage}
                        onChange={(e) =>
                          onUpdateDealStage(deal._id, e.target.value)
                        }
                        className={`table-stage-select badge-${deal.stage.toLowerCase()}`}
                      >
                        {DEAL_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {deal.expectedCloseDate
                        ? new Date(deal.expectedCloseDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div className="row-action-buttons">
                        <button
                          type="button"
                          className="icon-btn edit-icon-btn"
                          title="Edit deal"
                          onClick={() => onEditDeal(deal)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="icon-btn delete-icon-btn"
                          title="Delete deal"
                          onClick={() => onDeleteDeal(deal)}
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
        </div>
      )}
    </div>
  );
}
