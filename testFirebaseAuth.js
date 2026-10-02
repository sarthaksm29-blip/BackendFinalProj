const { initializeApp } = require("firebase/app");
const {
    getAuth,
    signInWithEmailAndPassword
} = require("firebase/auth");

const firebaseConfig = {
    apiKey: "REMOVED",
    authDomain: "saleshub-1ee9f.firebaseapp.com",
    projectId: "saleshub-1ee9f",
    storageBucket: "saleshub-1ee9f.firebasestorage.app",
    messagingSenderId: "503072071768",
    appId: "1:503072071768:web:1e239f6c8c19f97287aa2d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "sarthaksm29@gmail.com";
const password = "sarthaksm29";

async function test() {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("✅ Firebase login successful!");
        console.log("User:", userCredential.user.email);

        const token = await userCredential.user.getIdToken();

        const response = await fetch(
            "http://localhost:5001/api/firebase/protected",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("\nProtected route status:", response.status);
        console.log("Response:", await response.text());

    } catch (error) {
        console.error("❌ Error:", error.code || error.message);
        console.error(error.message);
    }
}

test();