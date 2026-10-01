const express = require("express");

const {
    createLead,
    getLeads,
    getLead,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Sales, managers and admins
router.post("/", protect, authorize("sales", "manager", "admin"), createLead);
router.get("/", protect, authorize("sales", "manager", "admin"), getLeads);
router.get("/:id", protect, authorize("sales", "manager", "admin"), getLead);
router.put("/:id", protect, authorize("sales", "manager", "admin"), updateLead);

// Only managers and admins can delete leads
router.delete("/:id", protect, authorize("manager", "admin"), deleteLead);

module.exports = router;