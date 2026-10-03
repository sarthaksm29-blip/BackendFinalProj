import React, { useState } from "react";
import api from "../api";

export default function NotificationsView({
  activityLogs = [],
  clearLogs,
  socketConnected,
  addToast,
}) {
  const [fcmToken, setFcmToken] = useState("");
  const [savingToken, setSavingToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(null);

  const handleSaveFcmToken = async (e) => {
    e.preventDefault();
    if (!fcmToken.trim()) return;

    setSavingToken(true);
    setTokenStatus(null);
    try {
      const res = await api.post("/notifications/fcm-token", {
        token: fcmToken.trim(),
      });
      setTokenStatus({
        type: "success",
        message: res.data.message || "FCM token saved successfully to your user profile in MongoDB!",
      });
      if (addToast) {
        addToast({
          type: "success",
          title: "Firebase Token Saved",
          message: "Your FCM token has been linked to your account.",
        });
      }
    } catch (err) {
      setTokenStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to save FCM token.",
      });
    } finally {
      setSavingToken(false);
    }
  };

  const handleQuickFillToken = () => {
    const demoToken = "fcm_token_demo_" + Math.random().toString(36).substring(2, 10);
    setFcmToken(demoToken);
  };

  return (
    <div className="notifications-view animate-fade-in">
      {/* Real-time System Status Banner */}
      <div className="system-status-grid">
        <div className="panel status-card">
          <div className="status-indicator-header">
            <span className={`pulsing-dot ${socketConnected ? "active" : "inactive"}`} />
            <div>
              <strong>Socket.IO Live Gateway</strong>
              <small>http://localhost:5001 (event: <code>pipelineUpdated</code>)</small>
            </div>
          </div>
          <p className="status-desc">
            {socketConnected
              ? "Connected in real-time. Any changes made to deals in MongoDB automatically stream to this dashboard without reloading."
              : "Connecting to Socket.io server..."}
          </p>
        </div>

        <div className="panel status-card">
          <div className="status-indicator-header">
            <span className="status-icon">🔥</span>
            <div>
              <strong>Firebase Cloud Messaging (FCM)</strong>
              <small>saleshub-1ee9f project configured</small>
            </div>
          </div>
          <p className="status-desc">
            Backend triggers push notifications on deal creation & stage progression when an FCM token is registered.
          </p>
        </div>
      </div>

      {/* FCM Token Registration Simulation Form */}
      <section className="panel fcm-section-panel">
        <div className="panel-header">
          <div>
            <h3>FCM Device Token Management</h3>
            <p>Register or update your device token to test Firebase push notifications</p>
          </div>
        </div>

        <form onSubmit={handleSaveFcmToken} className="fcm-token-form">
          <div className="token-input-row">
            <input
              type="text"
              placeholder="Paste Firebase Device Registration Token or use Quick Generate..."
              value={fcmToken}
              onChange={(e) => setFcmToken(e.target.value)}
              className="token-input"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleQuickFillToken}
            >
              Generate Test Token
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingToken || !fcmToken.trim()}
            >
              {savingToken ? "Saving..." : "Save FCM Token"}
            </button>
          </div>
        </form>

        {tokenStatus && (
          <div className={`token-status-notice ${tokenStatus.type} animate-fade-in`}>
            {tokenStatus.type === "success" ? "✓ " : "⚠ "}
            {tokenStatus.message}
          </div>
        )}
      </section>

      {/* Real-time Live Activity Feed */}
      <section className="panel live-activity-panel">
        <div className="panel-header">
          <div>
            <h3>Live Activity Log</h3>
            <p>Stream of pipeline and database events received during this session</p>
          </div>
          {activityLogs.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={clearLogs}
            >
              Clear Log
            </button>
          )}
        </div>

        {activityLogs.length === 0 ? (
          <div className="empty-panel-notice">
            <span className="empty-icon">⚡</span>
            <p>No activity recorded yet in this session.</p>
            <small>
              Create, move, or edit deals to see real-time Socket.IO broadcasts appear here live!
            </small>
          </div>
        ) : (
          <div className="activity-list">
            {activityLogs.map((log) => (
              <div key={log.id} className="activity-item animate-fade-in">
                <span className="activity-icon-badge">{log.icon || "⚡"}</span>
                <div className="activity-details">
                  <div className="activity-title-row">
                    <strong>{log.title}</strong>
                    <span className="activity-time">{log.time}</span>
                  </div>
                  <p className="activity-message">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
