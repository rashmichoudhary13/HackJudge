import { WebSocketServer } from "ws";
import { setupSpeechToText } from "./Socket/SpeechToText.js";
import { db } from "./config/firebaseAdmin.js";

export function initializeInterviewWebSocket(httpServer) {
    const wss = new WebSocketServer({
        server: httpServer,
        path: "/interview",
    });

    console.log("✅ Interview WebSocket initialized");

    wss.on("connection", async (client, req) => {
        console.log("Client Connected");

        const url = new URL(req.url, "http://localhost");

        const interviewId = url.searchParams.get("interviewId");
        const projectId = url.searchParams.get("projectId");

        const { startTime, duration } = await fetchTime(interviewId);

        const session = {
            interviewId,
            projectId,
            startTime,
            duration
        }

        await setupSpeechToText(client, session);
    });
}

const fetchTime = async (interviewId) => {
    if (!interviewId || interviewId === "null" || typeof interviewId !== "string") {
        return { startTime: Date.now(), duration: 300000 };
    }

    try {
        const interviewDoc = await db.collection('interviews').doc(interviewId).get();
        if (!interviewDoc.exists) {
            return { startTime: Date.now(), duration: 300000 };
        }

        const interview = interviewDoc.data();
        if (!interview) {
            return { startTime: Date.now(), duration: 300000 };
        }

        return {
            startTime: interview.startTime || Date.now(),
            duration: interview.duration || 300000
        }
    } catch (err) {
        console.error("Error fetching interview time: ", err);
        return { startTime: Date.now(), duration: 300000 };
    }
}