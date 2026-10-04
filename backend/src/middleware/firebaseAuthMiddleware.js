const { auth } = require("../config/firebase");

const firebaseProtect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Firebase authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await auth.verifyIdToken(token);

        req.firebaseUser = decodedToken;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired Firebase token"
        });
    }
};

module.exports = firebaseProtect;