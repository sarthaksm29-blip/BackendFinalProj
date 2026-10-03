const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dealRoutes = require("./routes/dealRoutes");
const contactRoutes = require("./routes/contactRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const reportRoutes = require("./routes/reportRoutes");
const firebaseAuthRoutes = require("./routes/firebaseAuthRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "SalesHub Backend is running!",
        status: "success"
    });
});

// ==================== API ROUTES ====================

// Authentication
app.use("/api/auth", authRoutes);

// Leads
app.use("/api/leads", leadRoutes);

// Deals
app.use("/api/deals", dealRoutes);

// Contacts
app.use("/api/contacts", contactRoutes);

// Pipelines
app.use("/api/pipelines", pipelineRoutes);

// Admin Reports
app.use("/api/admin/reports", reportRoutes);

// Firebase Authentication
app.use("/api/firebase", firebaseAuthRoutes);

// Firebase Notifications
app.use("/api/notifications", notificationRoutes);

// ==================== 404 HANDLER ====================

app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

module.exports = app;