const { io } = require("socket.io-client");

const socket = io("http://localhost:5001");

socket.on("connect", () => {
    console.log("Connected to Socket.io!");
    console.log("Socket ID:", socket.id);
});

socket.on("pipelineUpdated", (deal) => {
    console.log("🔥 PIPELINE UPDATED!");
    console.log(deal);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});