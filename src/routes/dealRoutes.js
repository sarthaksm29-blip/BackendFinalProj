const express = require("express");

const {
    createDeal,
    getDeals,
    getDeal,
    updateDeal,
    deleteDeal
} = require("../controllers/dealController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All authenticated users can view and create deals
router.post("/", protect, authorize("sales", "manager", "admin"), createDeal);
router.get("/", protect, authorize("sales", "manager", "admin"), getDeals);
router.get("/:id", protect, authorize("sales", "manager", "admin"), getDeal);

// Sales, managers and admins can update deals
router.put("/:id", protect, authorize("sales", "manager", "admin"), updateDeal);

// Only managers and admins can delete deals
router.delete("/:id", protect, authorize("manager", "admin"), deleteDeal);

module.exports = router;