import React, { useState, useEffect } from "react";
import Modal from "./Modal";

export default function ContactModal({
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
  const [designation, setDesignation] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setCompany(initialData.company || "");
      setDesignation(initialData.designation || "");
      setNotes(initialData.notes || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setDesignation("");
      setNotes("");
    }
    setFormError("");
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError("Name and Email are required.");
      return;
    }
    setFormError("");

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      designation: designation.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Contact" : "Add New Contact"}
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
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              placeholder="rahul@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label>Designation / Title</label>
            <input
              type="text"
              placeholder="e.g. VP of Technology"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div className="form-group flex-1">
            <label>Company / Organization</label>
            <input
              type="text"
              placeholder="e.g. Infosys / TCS"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+91 98123 45678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notes / Bio</label>
          <textarea
            placeholder="Key decision maker, preferred communication times..."
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
            {loading ? "Saving..." : initialData ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
