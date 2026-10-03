import React, { useState } from "react";

const STAGES = [
  { id: "Prospecting", label: "Prospecting", color: "#C8DFDB", icon: "📌" },
  { id: "Qualified", label: "Qualified", color: "#66A3BF", icon: "🎯" },
  { id: "Proposal", label: "Proposal", color: "#3368A0", icon: "📑" },
  { id: "Negotiation", label: "Negotiation", color: "#66A3BF", icon: "🤝" },
  { id: "Won", label: "Won", color: "#3368A0", icon: "🏆" },
  { id: "Lost", label: "Lost", color: "#C8DFDB", icon: "✕" },
];

export default function PipelineView({
  deals = [],
  onUpdateDealStage,
  onOpenNewDeal,
  onEditDeal,
  onDeleteDeal,
  loading = false,
}) {
  const [draggedDealId, setDraggedDealId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const formatCurrency = (amount) => {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  };

  const handleDragStart = (e, dealId) => {
    setDraggedDealId(dealId);
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (stageId) => {
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const dealId = draggedDealId || e.dataTransfer.getData("text/plain");
    if (!dealId) return;

    const deal = deals.find((d) => d._id === dealId);
    if (deal && deal.stage !== targetStage) {
      await onUpdateDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
  };

  // Move deal one step left or right
  const handleShiftStage = (deal, direction) => {
    const currentIndex = STAGES.findIndex((s) => s.id === deal.stage);
    if (currentIndex === -1) return;
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      onUpdateDealStage(deal._id, STAGES[newIndex].id);
    }
  };

  return (
    <div className="pipeline-view animate-fade-in">
      <div className="pipeline-toolbar">
        <div>
          <h2>Sales Pipeline Kanban Board</h2>
          <p>
            Drag and drop deals between columns or use stage controls to advance your deals
            {loading && <span className="cell-subtext"> • Syncing...</span>}
          </p>
        </div>
        <div className="pipeline-stats-pill">
          <span>Total Pipeline:</span>
          <strong>
            {formatCurrency(
              deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
            )}
          </strong>
          <small>({deals.length} deals)</small>
        </div>
      </div>

      <div className="pipeline-columns-container">
        {STAGES.map((stage, stageIdx) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageTotal = stageDeals.reduce(
            (sum, d) => sum + (Number(d.value) || 0),
            0
          );
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`pipeline-column ${isOver ? "drag-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => handleDragLeave(stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="column-header">
                <div className="column-title-row">
                  <span className="column-icon">{stage.icon}</span>
                  <span className="column-title">{stage.label}</span>
                  <span className="column-badge">{stageDeals.length}</span>
                </div>
                <div className="column-value-row">
                  <span className="column-total-val">{formatCurrency(stageTotal)}</span>
                  <button
                    type="button"
                    className="add-deal-column-btn"
                    title={`Add deal to ${stage.label}`}
                    onClick={() => onOpenNewDeal({ stage: stage.id })}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="column-cards-list">
                {stageDeals.length === 0 ? (
                  <div className="column-empty-state">
                    <span>No deals in {stage.label}</span>
                    <small>Drop deals here</small>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const isFirstStage = stageIdx === 0;
                    const isLastStage = stageIdx === STAGES.length - 1;

                    return (
                      <div
                        key={deal._id}
                        className={`kanban-card ${
                          draggedDealId === deal._id ? "is-dragging" : ""
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal._id)}
                      >
                        <div className="card-top-bar">
                          <span
                            className="card-indicator"
                            style={{ backgroundColor: stage.color }}
                          />
                          <div className="card-actions">
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

                        <h4
                          className="kanban-card-title"
                          onClick={() => onEditDeal(deal)}
                          title="Click to edit"
                        >
                          {deal.title}
                        </h4>

                        <div className="kanban-card-value">
                          {formatCurrency(deal.value)}
                        </div>

                        <div className="kanban-card-lead">
                          <span className="lead-icon">👤</span>
                          <span className="lead-name">
                            {deal.lead?.name || "Lead unassigned"}
                          </span>
                          {deal.lead?.company && (
                            <small className="lead-company">
                              • {deal.lead.company}
                            </small>
                          )}
                        </div>

                        {deal.expectedCloseDate && (
                          <div className="kanban-card-date">
                            <span>📅 Close:</span>{" "}
                            {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </div>
                        )}

                        <div className="card-stage-stepper">
                          <button
                            type="button"
                            className="stage-step-btn"
                            disabled={isFirstStage}
                            onClick={() => handleShiftStage(deal, -1)}
                            title="Move to previous stage"
                          >
                            ◀ Prev
                          </button>

                          <select
                            value={deal.stage}
                            onChange={(e) =>
                              onUpdateDealStage(deal._id, e.target.value)
                            }
                            className="card-stage-select"
                            title="Jump to stage"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="stage-step-btn"
                            disabled={isLastStage}
                            onClick={() => handleShiftStage(deal, 1)}
                            title="Advance to next stage"
                          >
                            Next ▶
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
