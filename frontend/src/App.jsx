import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import api from "./api";
import { initSocket, disconnectSocket } from "./socket";

import ToastContainer from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AuthPage from "./components/AuthPage";

import DashboardView from "./components/DashboardView";
import PipelineView from "./components/PipelineView";
import LeadsView from "./components/LeadsView";
import DealsView from "./components/DealsView";
import ContactsView from "./components/ContactsView";
import ReportsView from "./components/ReportsView";
import NotificationsView from "./components/NotificationsView";

import LeadModal from "./components/LeadModal";
import DealModal from "./components/DealModal";
import ContactModal from "./components/ContactModal";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("saleshub_user");
      return saved ? JSON.parse(saved) : { name: "Sales Rep", role: "sales" };
    } catch {
      return { name: "Sales Rep", role: "sales" };
    }
  });

  const [page, setPage] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Core CRM Data Collections
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(1);

  const addToast = useCallback((toast) => {
    const id = toastIdRef.current++;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([]);

  const addActivityLog = useCallback((title, message, icon = "⚡") => {
    const newLog = {
      id: Date.now() + Math.random(),
      title,
      message,
      icon,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Modal States
  const [leadModalState, setLeadModalState] = useState({
    isOpen: false,
    initialData: null,
  });

  const [dealModalState, setDealModalState] = useState({
    isOpen: false,
    initialData: null,
    preselectedStage: null,
    preselectedLeadId: null,
  });

  const [contactModalState, setContactModalState] = useState({
    isOpen: false,
    initialData: null,
  });

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    loading: false,
  });

  // Auth Handling
  const handleAuthSuccess = ({ user: authedUser, token: authToken }) => {
    localStorage.setItem("token", authToken);
    if (authedUser) {
      localStorage.setItem("saleshub_user", JSON.stringify(authedUser));
      setUser(authedUser);
    }
    setToken(authToken);
    addToast({
      type: "success",
      title: "Welcome to SalesHub",
      message: `Signed in as ${authedUser?.name || "User"} (${authedUser?.role || "sales"})`,
    });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("saleshub_user");
    setToken(null);
    setUser(null);
    setLeads([]);
    setDeals([]);
    setContacts([]);
    disconnectSocket();
    addToast({
      type: "info",
      title: "Signed Out",
      message: "You have been logged out securely.",
    });
  }, [addToast]);

  // Data Fetching
  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [leadsRes, dealsRes, contactsRes] = await Promise.allSettled([
        api.get("/leads"),
        api.get("/deals"),
        api.get("/contacts"),
      ]);

      if (leadsRes.status === "fulfilled") {
        setLeads(leadsRes.value.data?.leads || []);
      }
      if (dealsRes.status === "fulfilled") {
        setDeals(dealsRes.value.data?.deals || []);
      }
      if (contactsRes.status === "fulfilled") {
        setContacts(contactsRes.value.data?.contacts || []);
      }
    } catch (error) {
      console.error("Data loading error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial Data Load & Unauthorized Listener
  useEffect(() => {
    if (token) {
      fetchData();
    }
    const handleUnauthorized = () => {
      handleLogout();
    };
    window.addEventListener("saleshub:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("saleshub:unauthorized", handleUnauthorized);
    };
  }, [token, fetchData, handleLogout]);

  // Real-time Socket.IO Connection & Listener
  useEffect(() => {
    if (!token) return;

    const socket = initSocket();

    const onConnect = () => {
      setSocketConnected(true);
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onPipelineUpdated = (payload) => {
      console.log("⚡ Real-time pipeline update received:", payload);

      if (payload && payload.deletedDealId) {
        // Deal deleted
        setDeals((prev) => prev.filter((d) => d._id !== payload.deletedDealId));
        addActivityLog("Deal Removed", "A deal was deleted from the pipeline", "🗑️");
        addToast({
          type: "socket",
          title: "Pipeline Updated",
          message: "A deal was removed from the pipeline.",
        });
      } else if (payload && payload._id) {
        // Deal created or updated
        setDeals((prev) => {
          const exists = prev.some((d) => d._id === payload._id);
          if (exists) {
            return prev.map((d) => (d._id === payload._id ? payload : d));
          } else {
            return [payload, ...prev];
          }
        });

        addActivityLog(
          "Deal Pipeline Event",
          `Deal "${payload.title}" is in "${payload.stage}" stage`,
          "💰"
        );
        addToast({
          type: "socket",
          title: "Real-time Update",
          message: `Deal "${payload.title}" updated (${payload.stage})`,
        });
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pipelineUpdated", onPipelineUpdated);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pipelineUpdated", onPipelineUpdated);
    };
  }, [token, addActivityLog, addToast]);

  // ==================== LEAD ACTIONS ====================
  const handleOpenNewLead = () => {
    setLeadModalState({ isOpen: true, initialData: null });
  };

  const handleEditLead = (lead) => {
    setLeadModalState({ isOpen: true, initialData: lead });
  };

  const handleSubmitLead = async (leadData) => {
    try {
      if (leadModalState.initialData) {
        const id = leadModalState.initialData._id;
        const res = await api.put(`/leads/${id}`, leadData);
        const updated = res.data.lead || { ...leadModalState.initialData, ...leadData };
        setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
        addToast({
          type: "success",
          title: "Lead Updated",
          message: `Lead "${updated.name}" was successfully updated.`,
        });
      } else {
        const res = await api.post("/leads", leadData);
        const created = res.data.lead;
        setLeads((prev) => [created, ...prev]);
        addToast({
          type: "success",
          title: "Lead Created",
          message: `Lead "${created.name}" was added to your records.`,
        });
      }
      setLeadModalState({ isOpen: false, initialData: null });
    } catch (err) {
      addToast({
        type: "error",
        title: "Action Failed",
        message: err.response?.data?.message || "Failed to save lead.",
      });
    }
  };

  const handleDeleteLead = (lead) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Lead",
      message: `Are you sure you want to permanently delete "${lead.name}"? This action cannot be undone.`,
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModalState((prev) => ({ ...prev, loading: true }));
          await api.delete(`/leads/${lead._id}`);
          setLeads((prev) => prev.filter((l) => l._id !== lead._id));
          addToast({
            type: "info",
            title: "Lead Deleted",
            message: `Lead "${lead.name}" was removed.`,
          });
          setConfirmModalState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          addToast({
            type: "error",
            title: "Delete Failed",
            message: err.response?.data?.message || "Could not delete lead.",
          });
          setConfirmModalState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const handleConvertToDeal = (lead) => {
    setDealModalState({
      isOpen: true,
      initialData: null,
      preselectedStage: "Qualified",
      preselectedLeadId: lead._id,
    });
  };

  // ==================== DEAL ACTIONS ====================
  const handleOpenNewDeal = (opts = {}) => {
    setDealModalState({
      isOpen: true,
      initialData: null,
      preselectedStage: opts.stage || "Prospecting",
      preselectedLeadId: opts.leadId || null,
    });
  };

  const handleEditDeal = (deal) => {
    setDealModalState({
      isOpen: true,
      initialData: deal,
      preselectedStage: deal.stage,
      preselectedLeadId: deal.lead?._id || deal.lead,
    });
  };

  const handleSubmitDeal = async (dealData) => {
    try {
      if (dealModalState.initialData) {
        const id = dealModalState.initialData._id;
        const res = await api.put(`/deals/${id}`, dealData);
        const updated = res.data.deal || { ...dealModalState.initialData, ...dealData };
        setDeals((prev) => prev.map((d) => (d._id === id ? updated : d)));
        addToast({
          type: "success",
          title: "Deal Updated",
          message: `Deal "${updated.title}" saved successfully.`,
        });
      } else {
        const res = await api.post("/deals", dealData);
        const created = res.data.deal;
        setDeals((prev) => [created, ...prev]);
        addToast({
          type: "success",
          title: "Deal Created",
          message: `Deal "${created.title}" added to pipeline!`,
        });
      }
      setDealModalState({
        isOpen: false,
        initialData: null,
        preselectedStage: null,
        preselectedLeadId: null,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deal Save Failed",
        message: err.response?.data?.message || "Could not save deal.",
      });
    }
  };

  const handleUpdateDealStage = async (dealId, newStage) => {
    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => (d._id === dealId ? { ...d, stage: newStage } : d))
    );

    try {
      const res = await api.put(`/deals/${dealId}`, { stage: newStage });
      const updated = res.data.deal;
      setDeals((prev) => prev.map((d) => (d._id === dealId ? updated : d)));
      addToast({
        type: "success",
        title: "Stage Updated",
        message: `Deal moved to "${newStage}" stage.`,
      });
    } catch (err) {
      fetchData(); // Rollback
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update deal stage.",
      });
    }
  };

  const handleDeleteDeal = (deal) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Deal",
      message: `Are you sure you want to remove deal "${deal.title}" from the pipeline?`,
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModalState((prev) => ({ ...prev, loading: true }));
          await api.delete(`/deals/${deal._id}`);
          setDeals((prev) => prev.filter((d) => d._id !== deal._id));
          addToast({
            type: "info",
            title: "Deal Removed",
            message: `Deal "${deal.title}" was removed from the pipeline.`,
          });
          setConfirmModalState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          addToast({
            type: "error",
            title: "Delete Failed",
            message: err.response?.data?.message || "Could not delete deal.",
          });
          setConfirmModalState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // ==================== CONTACT ACTIONS ====================
  const handleOpenNewContact = () => {
    setContactModalState({ isOpen: true, initialData: null });
  };

  const handleEditContact = (contact) => {
    setContactModalState({ isOpen: true, initialData: contact });
  };

  const handleSubmitContact = async (contactData) => {
    try {
      if (contactModalState.initialData) {
        const id = contactModalState.initialData._id;
        const res = await api.put(`/contacts/${id}`, contactData);
        const updated = res.data.contact || { ...contactModalState.initialData, ...contactData };
        setContacts((prev) => prev.map((c) => (c._id === id ? updated : c)));
        addToast({
          type: "success",
          title: "Contact Updated",
          message: `Contact "${updated.name}" updated.`,
        });
      } else {
        const res = await api.post("/contacts", contactData);
        const created = res.data.contact;
        setContacts((prev) => [created, ...prev]);
        addToast({
          type: "success",
          title: "Contact Added",
          message: `Contact "${created.name}" added to directory.`,
        });
      }
      setContactModalState({ isOpen: false, initialData: null });
    } catch (err) {
      addToast({
        type: "error",
        title: "Action Failed",
        message: err.response?.data?.message || "Failed to save contact.",
      });
    }
  };

  const handleDeleteContact = (contact) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Contact",
      message: `Are you sure you want to remove "${contact.name}" from your contact directory?`,
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModalState((prev) => ({ ...prev, loading: true }));
          await api.delete(`/contacts/${contact._id}`);
          setContacts((prev) => prev.filter((c) => c._id !== contact._id));
          addToast({
            type: "info",
            title: "Contact Removed",
            message: `Contact "${contact.name}" deleted.`,
          });
          setConfirmModalState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          addToast({
            type: "error",
            title: "Delete Failed",
            message: err.response?.data?.message || "Could not delete contact.",
          });
          setConfirmModalState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // If user is not authenticated, show Auth Page
  if (!token) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() =>
          setConfirmModalState((prev) => ({ ...prev, isOpen: false }))
        }
        title={confirmModalState.title}
        message={confirmModalState.message}
        onConfirm={confirmModalState.onConfirm}
        loading={confirmModalState.loading}
      />

      {/* Lead Create/Edit Modal */}
      <LeadModal
        isOpen={leadModalState.isOpen}
        onClose={() => setLeadModalState({ isOpen: false, initialData: null })}
        onSubmit={handleSubmitLead}
        initialData={leadModalState.initialData}
      />

      {/* Deal Create/Edit Modal */}
      <DealModal
        isOpen={dealModalState.isOpen}
        onClose={() =>
          setDealModalState({
            isOpen: false,
            initialData: null,
            preselectedStage: null,
            preselectedLeadId: null,
          })
        }
        onSubmit={handleSubmitDeal}
        initialData={dealModalState.initialData}
        leads={leads}
        preselectedStage={dealModalState.preselectedStage}
        preselectedLeadId={dealModalState.preselectedLeadId}
        onOpenNewLead={handleOpenNewLead}
      />

      {/* Contact Create/Edit Modal */}
      <ContactModal
        isOpen={contactModalState.isOpen}
        onClose={() =>
          setContactModalState({ isOpen: false, initialData: null })
        }
        onSubmit={handleSubmitContact}
        initialData={contactModalState.initialData}
      />

      {/* Left Sidebar */}
      <Sidebar
        currentPage={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
        counts={{
          leads: leads.length,
          deals: deals.length,
          contacts: contacts.length,
        }}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        socketConnected={socketConnected}
      />

      {/* Main Content Area */}
      <main className="main-wrapper">
        <Header
          currentPage={page}
          user={user}
          onOpenNewLead={handleOpenNewLead}
          onOpenNewDeal={handleOpenNewDeal}
          onOpenNewContact={handleOpenNewContact}
          onRefresh={fetchData}
          loading={loading}
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />

        <div className="page-content-wrapper">
          {page === "Dashboard" && (
            <DashboardView
              leads={leads}
              deals={deals}
              contacts={contacts}
              loading={loading}
              setPage={setPage}
              onOpenNewLead={handleOpenNewLead}
              onOpenNewDeal={handleOpenNewDeal}
              onEditDeal={handleEditDeal}
            />
          )}

          {page === "Pipeline" && (
            <PipelineView
              deals={deals}
              onUpdateDealStage={handleUpdateDealStage}
              onOpenNewDeal={handleOpenNewDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              loading={loading}
            />
          )}

          {page === "Leads" && (
            <LeadsView
              leads={leads}
              loading={loading}
              onOpenNewLead={handleOpenNewLead}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              onConvertToDeal={handleConvertToDeal}
            />
          )}

          {page === "Deals" && (
            <DealsView
              deals={deals}
              loading={loading}
              onOpenNewDeal={handleOpenNewDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              onUpdateDealStage={handleUpdateDealStage}
            />
          )}

          {page === "Contacts" && (
            <ContactsView
              contacts={contacts}
              loading={loading}
              onOpenNewContact={handleOpenNewContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {page === "Reports" && (
            <ReportsView
              user={user}
              localDeals={deals}
              localLeads={leads}
            />
          )}

          {page === "Notifications" && (
            <NotificationsView
              activityLogs={activityLogs}
              clearLogs={() => setActivityLogs([])}
              socketConnected={socketConnected}
              deals={deals}
              addToast={addToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;