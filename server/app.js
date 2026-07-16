import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import routes from './routes/Routes.js';
import http from "http";
import { initializeInterviewWebSocket } from "./webSocket.js";

const app = express();

const allowedOrign = process.env.EXPRESS_FRONTEND_URL;
app.use(cors({ origin: allowedOrign, credentials: true }));

app.use(express.json());
app.use('/', routes);

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Interview WebSocket
initializeInterviewWebSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🎤 Interview WebSocket: ws://localhost:${PORT}/interview`);
});

export default app;