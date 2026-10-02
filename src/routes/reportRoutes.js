const express = require("express");

const { getReports } = require("../controllers/reportController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin", "manager"), getReports);

module.exports = router;
