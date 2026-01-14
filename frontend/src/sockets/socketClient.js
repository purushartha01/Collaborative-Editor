import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const documentSocket = io(`${SERVER_URL}/documents`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
});

export const aiSocket = io(`${SERVER_URL}/ai`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
});