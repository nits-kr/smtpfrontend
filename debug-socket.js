import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: false
});

console.log("Attempting to connect to http://localhost:3000...");

socket.on("connect", () => {
    console.log("✅ Connected! Socket ID:", socket.id);
    console.log("Waiting for 'campaign-progress' events...");
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection Error:", err.message);
    process.exit(1);
});

socket.on("campaign-progress", (data) => {
    console.log("🔥 RECEIVED EVENT:", JSON.stringify(data, null, 2));
});

socket.on("disconnect", () => {
    console.log("Disconnected.");
});

// Keep alive for a bit
setTimeout(() => {
    console.log("Timeout reached. Exiting.");
    socket.close();
}, 30000);
