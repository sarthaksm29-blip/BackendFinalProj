const express = require("express");

const {
    saveFcmToken
} = require("../controllers/notificationController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/token",
    protect,
    saveFcmToken
);

module.exports = router;