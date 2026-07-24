import WebSocket from "ws";
import { db } from "../config/firebaseAdmin.js";
import { judgeConfig } from "../config/judgeConfig.js";
import { sessions } from "./sessionManager.js";
import { initializeChat } from "./processInterview_ws.js";
import { connectToDeepgram } from "./deepgramSocket.js";

export async function setupSpeechToText(client, sessionInfo) {
    const { interviewId, projectId, startTime, duration } = sessionInfo;

    try {
        // 1. Fetch project and interview details
        const projectDoc = await db.collection('projects').doc(projectId).get();
        const project = projectDoc.data();

        const interviewDoc = await db.collection('interviews').doc(interviewId).get();
        const interview = interviewDoc.data();

        const conversation = interview.conversation || [];
        const judge = project.judgeType;
        const config = judgeConfig[judge];

        // 2. Create Gemini chat session using separate processInterview_ws module
        const chat = initializeChat(project, config, conversation);

        // Create the session store entry
        const session = {
            interviewId,
            projectId,
            client,
            chat,
            startTime,
            duration,
            conversation,
            audioQueue: [],
            transcriptParts: []
        };
        sessions.set(interviewId, session);

        // 3. Connect to Deepgram STT WebSocket
        const deepgramSTT = connectToDeepgram(session);
        session.deepgramSTT = deepgramSTT;

        // Set up client messages (microphone stream)
        client.on("message", (message, isBinary) => {
            if (!isBinary) return;

            if (deepgramSTT.readyState !== WebSocket.OPEN) {
                // Buffer the chunk until the Deepgram socket is open
                session.audioQueue.push(message);
                return;
            }

            // Sending to Deepgram WebSocket directly as binary to get transcript
            deepgramSTT.send(message);
        });

        // Handle client connection closing
        client.on("close", () => {
            console.log(`Client disconnected for interview ${interviewId}`);
            try {
                if (deepgramSTT) {
                    deepgramSTT.close();
                }
            } catch (err) {
                console.error("Error closing Deepgram STT on client disconnect:", err);
            }

            sessions.delete(interviewId);
        });

    } catch (error) {
        console.error("Error setting up interview socket session: ", error);
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "error",
                message: "Internal server error occurred when starting speech to text session."
            }));
        }
    }
}