import React, { useState, useMemo } from "react";

export default function ContactsView({
  contacts = [],
  loading = false,
  onOpenNewContact,
  onEditContact,
  onDeleteContact,
}) {
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.designation?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  return (
    <div className="contacts-view animate-fade-in">
      {/* View Toolbar */}
      <div className="view-toolbar">
        <div className="toolbar-search-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search contacts by name, email, company, title..."
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
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onOpenNewContact()}
        >
          <span>+ Add Contact</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading contact directory...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="panel empty-panel-notice">
          <p>
            {search
              ? "No contacts matched your search query."
              : "No contacts found in the directory."}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => (search ? setSearch("") : onOpenNewContact())}
          >
            {search ? "Clear Search" : "+ Add First Contact"}
          </button>
        </div>
      ) : (
        <div className="contacts-grid">
          {filteredContacts.map((contact) => (
            <div className="contact-card animate-fade-in" key={contact._id}>
              <div className="contact-card-header">
                <div className="contact-avatar-bubble">
                  {contact.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div className="contact-info-header">
                  <h4 onClick={() => onEditContact(contact)} title="Edit contact">
                    {contact.name}
                  </h4>
                  {contact.designation && (
                    <span className="contact-designation-badge">
                      {contact.designation}
                    </span>
                  )}
                </div>

                <div className="contact-actions">
                  <button
                    type="button"
                    className="icon-btn edit-icon-btn"
                    title="Edit contact"
                    onClick={() => onEditContact(contact)}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-icon-btn"
                    title="Delete contact"
                    onClick={() => onDeleteContact(contact)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {contact.company && (
                <div className="contact-meta-row">
                  <span className="contact-meta-icon">🏢</span>
                  <span className="contact-company-name">{contact.company}</span>
                </div>
              )}

              <div className="contact-links-list">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="contact-channel-link"
                    title="Email contact"
                  >
                    ✉ {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="contact-channel-link"
                    title="Call contact"
                  >
                    📞 {contact.phone}
                  </a>
                )}
              </div>

              {contact.notes && (
                <div className="contact-notes-box">
                  <small>💬 {contact.notes}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
