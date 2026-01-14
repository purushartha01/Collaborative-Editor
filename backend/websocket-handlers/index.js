import { Server } from "socket.io";
import { registerAllNamespaces } from "./namespaces/index.js";

let io;

export const initializeWebSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    });

    io.engine.on("connection_error", (err) => {
        console.error("WebSocket connection error:", err);
    });

    registerAllNamespaces(io);

    console.log("WebSocket server initialized");

    return io;
}

export const getIO = () => {
    if (!io) {
        throw new Error("WebSocket not initialized!");
    }
    return io;
}