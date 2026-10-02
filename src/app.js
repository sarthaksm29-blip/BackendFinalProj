const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dealRoutes = require("./routes/dealRoutes");
const contactRoutes = require("./routes/contactRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const reportRoutes = require("./routes/reportRoutes");
const firebaseAuthRoutes = require("./routes/firebaseAuthRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SalesHub Backend is running!"
    });
});

// Authentication
app.use("/api/auth", authRoutes);
app.use("/api/firebase", firebaseAuthRoutes);

// Main APIs
app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/reports", reportRoutes);

// Firebase notifications
app.use("/api/notifications", notificationRoutes);

module.exports = app;