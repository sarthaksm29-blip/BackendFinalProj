const http = require("http");
const dotenv = require("dotenv");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initializeSocket } = require("./src/socket/socket");

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Connect MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});