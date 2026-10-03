import React, { useEffect, useState } from "react";
import api from "../api";

export default function ReportsView({ user, localDeals = [], localLeads = [] }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);

    try {
      const res = await api.get("/reports");
      setReportData(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setForbidden(true);
      } else {
        setError(err.response?.data?.message || "Failed to load reports");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (val) => {
    return "₹" + Number(val || 0).toLocaleString("en-IN");
  };

  const localTotalValue = localDeals.reduce(
    (sum, d) => sum + (Number(d.value) || 0),
    0
  );
  const localAvgDeal = localDeals.length > 0
    ? Math.round(localTotalValue / localDeals.length)
    : 0;

  return (
    <div className="reports-view animate-fade-in">
      <div className="reports-header-panel">
        <div>
          <h2>Sales Analytics & Executive Reports</h2>
          <p>Real-time database aggregations from <code>/api/reports</code></p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh Metrics"}
        </button>
      </div>

      {forbidden && (
        <div className="panel role-notice-panel animate-fade-in">
          <div className="notice-icon">🔒</div>
          <div className="notice-content">
            <h4>Manager / Admin Role Required</h4>
            <p>
              Your account currently has the <strong>{user?.role}</strong> role. The backend
              route <code>GET /api/reports</code> is protected by role-based access control (RBAC)
              for <code>admin</code> and <code>manager</code> only.
            </p>
            <p className="notice-hint">
              💡 <em>To view executive reports, log out and sign in or register with the <strong>Manager</strong> or <strong>Admin</strong> role using the preset selector!</em>
            </p>
          </div>
        </div>
      )}

      {error && !forbidden && (
        <div className="panel error-notice-panel">
          <p>⚠ {error}</p>
        </div>
      )}

      {/* Aggregate Stats Section */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Deals</span>
            <span className="stat-icon-badge purple">📊</span>
          </div>
          <strong className="stat-value">
            {reportData ? reportData.totalDeals : localDeals.length}
          </strong>
          <div className="stat-footer">
            <small>{reportData ? "Global database total" : "Local deals loaded"}</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Total Leads</span>
            <span className="stat-icon-badge blue">👥</span>
          </div>
          <strong className="stat-value">
            {reportData ? reportData.totalLeads : localLeads.length}
          </strong>
          <div className="stat-footer">
            <small>Lead pipeline records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Total Deal Value</span>
            <span className="stat-icon-badge green">💰</span>
          </div>
          <strong className="stat-value">
            {formatCurrency(
              reportData ? reportData.totalDealValue : localTotalValue
            )}
          </strong>
          <div className="stat-footer">
            <small>MongoDB Aggregate sum</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Avg Deal Value</span>
            <span className="stat-icon-badge amber">📈</span>
          </div>
          <strong className="stat-value">
            {formatCurrency(
              reportData && reportData.totalDeals > 0
                ? Math.round(reportData.totalDealValue / reportData.totalDeals)
                : localAvgDeal
            )}
          </strong>
          <div className="stat-footer">
            <small>Across opportunities</small>
          </div>
        </div>
      </section>

      {/* Deals by Stage Breakdown */}
      <section className="panel reports-stage-panel">
        <div className="panel-header">
          <div>
            <h3>Stage Performance Breakdown</h3>
            <p>Aggregated deal count and value by pipeline stage</p>
          </div>
        </div>

        {reportData && reportData.dealsByStage && reportData.dealsByStage.length > 0 ? (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Deals Count</th>
                  <th>Total Stage Value</th>
                  <th>Share of Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {reportData.dealsByStage.map((st) => {
                  const share = reportData.totalDealValue > 0
                    ? Math.round((st.value / reportData.totalDealValue) * 100)
                    : 0;
                  return (
                    <tr key={st._id}>
                      <td>
                        <span className={`badge badge-${st._id?.toLowerCase()}`}>
                          {st._id}
                        </span>
                      </td>
                      <td>
                        <strong>{st.count}</strong> deals
                      </td>
                      <td className="deal-value-cell">
                        {formatCurrency(st.value)}
                      </td>
                      <td>
                        <div className="table-progress-bar">
                          <div
                            className="table-progress-fill"
                            style={{ width: `${share}%` }}
                          />
                          <span className="share-text">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="stage-cards-mini-grid">
            {localDeals.length > 0 ? (
              localDeals.slice(0, 6).map((deal) => (
                <div className="mini-stage-card" key={deal._id}>
                  <div className="mini-title">{deal.title}</div>
                  <div className="mini-val">{formatCurrency(deal.value)}</div>
                  <span className={`badge badge-${deal.stage.toLowerCase()}`}>
                    {deal.stage}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-panel-notice">
                <p>No deal data available to generate stage report.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
