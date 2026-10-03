import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Cold Call",
  "Other",
];

const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

export default function LeadModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("Website");
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setCompany(initialData.company || "");
      setSource(initialData.source || "Website");
      setStatus(initialData.status || "New");
      setNotes(initialData.notes || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setSource("Website");
      setStatus("New");
      setNotes("");
    }
    setFormError("");
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Name, Email, and Phone number are required.");
      return;
    }
    setFormError("");

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      source,
      status,
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Lead" : "Create New Lead"}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} className="custom-form">
        {formError && <div className="form-error-alert">{formError}</div>}

        <div className="form-row">
          <div className="form-group flex-1">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label>Company</label>
            <input
              type="text"
              placeholder="e.g. Acme Innovations"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              placeholder="priya@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label>
              Phone Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label>Lead Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="custom-select"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="custom-select"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Notes / Context</label>
          <textarea
            placeholder="Details about customer requirements or initial conversations..."
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
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Save Changes" : "Create Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
