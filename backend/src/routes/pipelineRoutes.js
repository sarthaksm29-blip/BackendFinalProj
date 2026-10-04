const express = require("express");

const { getPipeline } = require("../controllers/pipelineController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPipeline);

module.exports = router;
