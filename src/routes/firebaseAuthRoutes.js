const express = require("express");
const firebaseProtect = require("../middleware/firebaseAuthMiddleware");

const router = express.Router();

router.get("/protected", firebaseProtect, (req, res) => {
    res.json({
        message: "Firebase authentication successful",
        user: req.firebaseUser
    });
});

module.exports = router;