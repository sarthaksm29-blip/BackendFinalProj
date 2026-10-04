const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getMessaging } = require("firebase-admin/messaging");
const path = require("path");

const serviceAccount = require(
    path.join(__dirname, "../../firebase-service-account.json")
);

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount)
    });

const auth = getAuth(app);
const messaging = getMessaging(app);

module.exports = {
    app,
    auth,
    messaging
};