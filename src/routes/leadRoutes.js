const express = require("express");

const {
    createLead,
    getLeads,
    getLead,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const { protect } = require("../middleware/authMiddleware");

const { validateRequired } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    validateRequired(["name", "email", "phone", "company"]),
    createLead
);

router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

module.exports = router;