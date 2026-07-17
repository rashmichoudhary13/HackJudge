import WebSocket from "ws";
import { db } from "../config/firebaseAdmin.js";
import { judgeConfig } from "../config/judgeConfig.js";
import { sessions } from "./sessionManager.js";
import { streamTTS } from "./generatingAudio.js";
import { initializeChat, generateNextQuestion } from "./processInterview_ws.js";

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

        // 3. Open Deepgram STT WebSocket
        const deepgramUrl = "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&model=nova-2&language=en-US&interim_results=true&endpointing=600";
        const deepgramSTT = new WebSocket(
            deepgramUrl,
            {
                headers: {
                    Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`
                }
            }
        );

        // Create the session store entry
        const session = {
            interviewId,
            projectId,
            client,
            chat,
            deepgramSTT,
            startTime,
            duration,
            conversation,
            audioQueue: [],
            transcriptParts: []
        };
        sessions.set(interviewId, session);

        const keepAliveInterval = setInterval(() => {
            if (deepgramSTT.readyState === WebSocket.OPEN) {
                deepgramSTT.send(JSON.stringify({ type: "KeepAlive" }));
            }
        }, 3000);

        deepgramSTT.on("open", () => {
            console.log(`Deepgram connected for interview ${interviewId}`);
            // Send all buffered chunks
            while (session.audioQueue.length > 0 && deepgramSTT.readyState === WebSocket.OPEN) {
                const chunk = session.audioQueue.shift();
                deepgramSTT.send(chunk);
            }
        });

        deepgramSTT.on("message", async (data) => {
            let result;
            try {
                result = JSON.parse(data.toString());
            } catch (err) {
                console.error("Error parsing Deepgram message JSON:", err);
                return;
            }

            const alternatives = result.channel?.alternatives || [];
            const transcript = alternatives[0]?.transcript || "";

            if (result.is_final) {
                if (transcript.trim()) {
                    session.transcriptParts.push(transcript.trim());
                }
            } else {
                // Interim result
                const currentPartial = [...session.transcriptParts, transcript].filter(Boolean).join(" ");
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "partial_transcript",
                        text: currentPartial
                    }));
                }
            }

            if (result.speech_final) {
                const finalTranscript = session.transcriptParts.join(" ").trim();
                session.transcriptParts = []; // Reset for next turn

                if (finalTranscript) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "committed_transcript",
                            text: finalTranscript,
                        }));
                    }

                    const elapsed = Date.now() - startTime;

                    if (elapsed >= duration) {
                        console.log(`Interview duration reached for ${interviewId}`);

                        // Append the final answer
                        session.conversation[session.conversation.length - 1].candidateAnswer = finalTranscript;
                        await db.collection('interviews').doc(interviewId).update({
                            conversation: session.conversation
                        });

                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "interview_end"
                            }));
                        }

                        // Stream end audio
                        await streamTTS("We've reached the end of the interview. Thank you for your presentation.", client);

                        //Close Deepgram
                        try {
                            deepgramSTT.close();
                        } catch (err) {
                            console.error("Error closing Deepgram STT on timeout:", err);
                        }

                        // Clean up
                        sessions.delete(interviewId);
                        return;
                    }

                    console.log(`Processing committed transcript for ${interviewId}: "${finalTranscript}"`);
                    try {
                        // Append the user transcript to conversation
                        session.conversation[session.conversation.length - 1].candidateAnswer = finalTranscript;

                        // Persist to Firestore
                        await db.collection('interviews').doc(interviewId).update({
                            conversation: session.conversation
                        });

                        // Send user response to Gemini chat and get next question
                        console.time('Gemini response time');
                        const question = await generateNextQuestion(session.chat, finalTranscript);
                        console.timeEnd('Gemini response time');

                        // Send the next question text to the client
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "question",
                                question
                            }));
                        }

                        // Stream the next question audio (TTS)
                        await streamTTS(question, client);

                        // Push the next question turn
                        session.conversation.push({
                            judgeQuestion: question,
                            candidateAnswer: ""
                        });

                        // Persist conversation to Firestore
                        await db.collection('interviews').doc(interviewId).update({
                            conversation: session.conversation
                        });

                    } catch (err) {
                        console.error("Error generating next question: ", err);
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "error",
                                message: "Unable to generate the next question. Please try again."
                            }));
                        }
                    }
                }
            }
        });

        deepgramSTT.on("error", (err) => {
            console.error(`Deepgram error for interview ${interviewId}: `, err);
        });

        deepgramSTT.on("close", (code, reason) => {
            console.log(`Deepgram connection closed for interview ${interviewId}: ${code} - ${reason}`);
            clearInterval(keepAliveInterval);
        });

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
                deepgramSTT.close();
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