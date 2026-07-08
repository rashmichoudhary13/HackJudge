import { WebSocketServer } from "ws";
import { setupSpeechToText } from "./Socket/SpeechToText.js";
import { db } from "./config/firebaseAdmin.js";

export function initializeInterviewWebSocket(httpServer) {
    const wss = new WebSocketServer({
        server: httpServer,
        path: "/interview",
    });

    console.log("✅ Interview WebSocket initialized");

    wss.on("connection", (client, req) => {
        console.log("Client Connected");

        const url = new URL(req.url, "http://localhost");

        const interviewId = url.searchParams.get("interviewId");
        const projectId = url.searchParams.get("projectId");

        const {startTime, duration} = fetchTime(interviewId);

        const session = {
            interviewId,
            projectId,
            startTime,
            duration
        }

        setupSpeechToText(client, session);
    });
}

const fetchTime = async(interviewId) => {
    
    const interviewDoc = await db.collection('interviews').doc(interviewId).get();

    const interview = interviewDoc.data();

    return {
        startTime: interview.startTime, 
        duration: interview.duration
    }
}