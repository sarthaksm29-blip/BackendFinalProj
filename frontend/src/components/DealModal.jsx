import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const STAGES = [
  "Prospecting",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export default function DealModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  leads = [],
  preselectedStage = null,
  preselectedLeadId = null,
  loading = false,
  onOpenNewLead,
}) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Prospecting");
  const [leadId, setLeadId] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setValue(initialData.value !== undefined ? String(initialData.value) : "");
      setStage(initialData.stage || "Prospecting");
      setLeadId(
        initialData.lead?._id ||
          (typeof initialData.lead === "string" ? initialData.lead : "")
      );
      if (initialData.expectedCloseDate) {
        const d = new Date(initialData.expectedCloseDate);
        setExpectedCloseDate(d.toISOString().split("T")[0]);
      } else {
        setExpectedCloseDate("");
      }
      setNotes(initialData.notes || "");
    } else {
      setTitle("");
      setValue("");
      setStage(preselectedStage || "Prospecting");
      setLeadId(preselectedLeadId || (leads.length > 0 ? leads[0]._id : ""));
      setExpectedCloseDate("");
      setNotes("");
    }
    setFormError("");
  }, [initialData, isOpen, preselectedStage, preselectedLeadId, leads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Deal title is required.");
      return;
    }
    if (value === "" || isNaN(Number(value)) || Number(value) < 0) {
      setFormError("Valid positive deal value is required.");
      return;
    }
    if (!leadId) {
      setFormError("Please select a lead associated with this deal.");
      return;
    }
    setFormError("");

    await onSubmit({
      title: title.trim(),
      value: Number(value),
      stage,
      lead: leadId,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate).toISOString() : null,
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Deal" : "Create Deal Opportunity"}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} className="custom-form">
        {formError && <div className="form-error-alert">{formError}</div>}

        <div className="form-group">
          <label>
            Deal Title <span className="req">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Enterprise Cloud SaaS Renewal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label>
              Deal Value (₹ INR) <span className="req">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 500000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label>Pipeline Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="custom-select"
            >
              {STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="label-with-action">
            <label>
              Associated Lead <span className="req">*</span>
            </label>
            {leads.length === 0 && onOpenNewLead && (
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  onClose();
                  onOpenNewLead();
                }}
              >
                + Create a Lead first
              </button>
            )}
          </div>

          {leads.length === 0 ? (
            <div className="form-warning-notice">
              No leads found. Deals must be connected to a Lead. Please create a lead first.
            </div>
          ) : (
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="custom-select"
              required
            >
              <option value="" disabled>
                -- Select a Lead --
              </option>
              {leads.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name} {l.company ? `(${l.company})` : ""} - {l.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Expected Close Date</label>
          <input
            type="date"
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Deal Notes / Next Steps</label>
          <textarea
            placeholder="Contract terms, stakeholder objections, follow-up timeline..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || (leads.length === 0 && !initialData)}
          >
            {loading ? "Saving..." : initialData ? "Save Deal" : "Create Deal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
