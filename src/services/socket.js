import io from 'socket.io-client';

// Replace with actual backend URL
const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
});

socket.on("connect", () => {
    console.log("✅ Socket connected");
    console.log("🆔 Socket ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
});

socket.on("connect_error", (err) => {
    console.error("🚨 Socket connection error:", err.message);
});

socket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Reconnect attempt:", attempt);
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
