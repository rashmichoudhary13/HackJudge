import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({
    server: httpServer,
    path: "/interview"
});