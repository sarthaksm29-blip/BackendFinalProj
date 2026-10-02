const User = require("../models/User");

const saveFcmToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "FCM token is required"
            });
        }

        await User.findByIdAndUpdate(
            req.user.id,
            {
                fcmToken: token
            },
            {
                new: true
            }
        );

        res.json({
            message: "FCM token saved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to save FCM token",
            error: error.message
        });
    }
};

module.exports = {
    saveFcmToken
};