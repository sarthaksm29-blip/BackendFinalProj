import React from "react";

const STAGES = [
  "Prospecting",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const STAGE_COLORS = {
  Prospecting: "#C8DFDB",
  Qualified: "#66A3BF",
  Proposal: "#3368A0",
  Negotiation: "#66A3BF",
  Won: "#3368A0",
  Lost: "#C8DFDB",
};

export default function DashboardView({
  leads = [],
  deals = [],
  contacts = [],
  loading = false,
  setPage,
  onOpenNewLead,
  onOpenNewDeal,
  onEditDeal,
}) {
  const totalPipeline = deals.reduce(
    (sum, d) => sum + (Number(d.value) || 0),
    0
  );

  const wonDealsList = deals.filter((d) => d.stage === "Won");
  const wonValue = wonDealsList.reduce(
    (sum, d) => sum + (Number(d.value) || 0),
    0
  );

  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage).length;
    return acc;
  }, {});

  const stageValues = STAGES.reduce((acc, stage) => {
    acc[stage] = deals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  };

  const winRate = deals.length > 0
    ? Math.round((wonDealsList.length / deals.length) * 100)
    : 0;

  return (
    <div className="dashboard-view animate-fade-in">
      {/* Metric Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Leads</span>
            <span className="stat-icon-badge blue">👥</span>
          </div>
          <strong className="stat-value">{leads.length}</strong>
          <div className="stat-footer">
            <span className="stat-pill success">Live Database</span>
            <small>Active prospects</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Active Deals</span>
            <span className="stat-icon-badge purple">💰</span>
          </div>
          <strong className="stat-value">{deals.length}</strong>
          <div className="stat-footer">
            <span className="stat-pill neutral">{winRate}% Win Rate</span>
            <small>Across all stages</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Pipeline Value</span>
            <span className="stat-icon-badge green">📈</span>
          </div>
          <strong className="stat-value">{formatCurrency(totalPipeline)}</strong>
          <div className="stat-footer">
            <small>Total open & closed value</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Won Deals</span>
            <span className="stat-icon-badge amber">🏆</span>
          </div>
          <strong className="stat-value">{formatCurrency(wonValue)}</strong>
          <div className="stat-footer">
            <span className="stat-pill success">{wonDealsList.length} Deals Closed</span>
            <small>Revenue captured</small>
          </div>
        </div>
      </section>

      {/* Stage Breakdown Bar */}
      <section className="panel pipeline-progress-panel">
        <div className="panel-header">
          <div>
            <h3>Pipeline Distribution by Stage</h3>
            <p>Visual status of deals flowing through your sales funnel</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setPage("Pipeline")}
          >
            Open Kanban Board →
          </button>
        </div>

        <div className="stage-progress-bar-wrapper">
          {deals.length === 0 ? (
            <div className="empty-bar-notice">No deals in pipeline yet. Create a deal to populate the funnel!</div>
          ) : (
            <div className="stage-progress-track">
              {STAGES.map((st) => {
                const count = stageCounts[st];
                if (count === 0) return null;
                const pct = (count / deals.length) * 100;
                return (
                  <div
                    key={st}
                    className="stage-segment"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: STAGE_COLORS[st],
                    }}
                    title={`${st}: ${count} deals (${formatCurrency(stageValues[st])})`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="stage-pills-row">
          {STAGES.map((st) => (
            <div key={st} className="stage-pill-item">
              <span
                className="stage-dot"
                style={{ backgroundColor: STAGE_COLORS[st] }}
              />
              <span className="stage-name">{st}</span>
              <strong className="stage-count">{stageCounts[st]}</strong>
              <small className="stage-amount">({formatCurrency(stageValues[st])})</small>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Strip */}
      <div className="quick-actions-strip">
        <button
          type="button"
          className="action-chip"
          onClick={onOpenNewLead}
        >
          <span>👥</span> + New Lead
        </button>
        <button
          type="button"
          className="action-chip"
          onClick={onOpenNewDeal}
        >
          <span>💰</span> + New Deal
        </button>
        <button
          type="button"
          className="action-chip"
          onClick={() => setPage("Pipeline")}
        >
          <span>📋</span> Kanban Pipeline
        </button>
        <button
          type="button"
          className="action-chip"
          onClick={() => setPage("Contacts")}
        >
          <span>📇</span> Contacts Directory ({contacts.length})
        </button>
      </div>

      {/* Split Panels: Recent Deals & Recent Leads */}
      <div className="dashboard-panels-grid">
        {/* Recent Deals */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Deals</h3>
              <p>Latest deals added or moved in your pipeline</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setPage("Deals")}
            >
              View all ({deals.length})
            </button>
          </div>

          {loading ? (
            <div className="loading-state">Loading deals...</div>
          ) : deals.length === 0 ? (
            <div className="empty-panel-notice">
              <p>No deals found.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenNewDeal}
              >
                + Create First Deal
              </button>
            </div>
          ) : (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Deal Title</th>
                    <th>Value</th>
                    <th>Lead</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.slice(0, 5).map((deal) => (
                    <tr
                      key={deal._id}
                      className="clickable-row"
                      onClick={() => onEditDeal && onEditDeal(deal)}
                      title="Click to view/edit deal"
                    >
                      <td className="deal-title-cell">
                        <strong>{deal.title}</strong>
                      </td>
                      <td className="deal-value-cell">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="deal-lead-cell">
                        {deal.lead?.name || "—"}
                      </td>
                      <td>
                        <span className={`badge badge-${deal.stage.toLowerCase()}`}>
                          {deal.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Leads */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Leads</h3>
              <p>Prospective customers waiting for outreach</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setPage("Leads")}
            >
              View all ({leads.length})
            </button>
          </div>

          {loading ? (
            <div className="loading-state">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="empty-panel-notice">
              <p>No leads found.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenNewLead}
              >
                + Create First Lead
              </button>
            </div>
          ) : (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <strong>{lead.name}</strong>
                        <div className="cell-subtext">{lead.email}</div>
                      </td>
                      <td>{lead.company || "—"}</td>
                      <td>
                        <span className="source-pill">{lead.source || "Other"}</span>
                      </td>
                      <td>
                        <span
                          className={`badge status-${(lead.status || "New").toLowerCase()}`}
                        >
                          {lead.status || "New"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
