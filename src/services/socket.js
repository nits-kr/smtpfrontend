import io from 'socket.io-client';

// Replace with actual backend URL
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket'],
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
