const { messaging } = require("../config/firebase");

const sendNotification = async ({
    token,
    title,
    body,
    data = {}
}) => {
    if (!token) {
        console.log("No FCM token available. Skipping notification.");
        return null;
    }

    try {
        const messageId = await messaging.send({
            token,
            notification: {
                title,
                body
            },
            data: Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    String(value)
                ])
            )
        });

        console.log("Firebase notification sent:", messageId);

        return messageId;

    } catch (error) {
        console.error(
            "Firebase notification failed:",
            error.message
        );

        return null;
    }
};

module.exports = sendNotification;