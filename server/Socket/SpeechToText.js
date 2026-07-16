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

        // 3. Open ElevenLabs STT WebSocket
        const elevenLabsSTT = new WebSocket(
            process.env.ELEVENLAB_STT_URI,
            {
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY
                }
            }
        );

        // Create the session store entry
        const session = {
            interviewId,
            projectId,
            client,
            chat,
            elevenLabsSTT,
            startTime,
            duration,
            conversation,
            audioQueue: []
        };
        sessions.set(interviewId, session);



        elevenLabsSTT.on("open", () => {
            console.log(`ElevenLabs connected for interview ${interviewId}`);
            // Send all buffered chunks
            while (session.audioQueue.length > 0 && elevenLabsSTT.readyState === WebSocket.OPEN) {
                const chunk = session.audioQueue.shift();
                elevenLabsSTT.send(JSON.stringify({
                    message_type: "input_audio_chunk",
                    audio_base_64: chunk.toString("base64"),
                    commit: false,
                    sample_rate: 16000
                }));
            }
        });

        elevenLabsSTT.on("message", async (data) => {
            const result = JSON.parse(data.toString());
            console.log(result.message_type);

            switch (result.message_type) {
                case "session_started":
                    console.log(`STT session started for ${interviewId}`);
                    break;

                case "partial_transcript":
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "partial_transcript",
                            text: result.text
                        }));
                    }
                    break;

                case "committed_transcript": {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "committed_transcript",
                            text: result.text,
                        }));
                    }

                    const elapsed = Date.now() - startTime;

                    if (elapsed >= duration) {
                        console.log(`Interview duration reached for ${interviewId}`);

                        // Append the final answer
                        session.conversation[session.conversation.length - 1].candidateAnswer = result.text;
                        await db.collection('interviews').doc(interviewId).update({
                            conversation: session.conversation
                        });

                        // Stream end audio
                        await streamTTS("We've reached the end of the interview. Thank you for your presentation.", client);

                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "interview_end"
                            }));
                        }

                        // Close ElevenLabs
                        try {
                            elevenLabsSTT.close();
                        } catch (err) {
                            console.error("Error closing ElevenLabs STT on timeout:", err);
                        }

                        // Clean up
                        sessions.delete(interviewId);
                        return;
                    }

                    console.log(`Processing committed transcript for ${interviewId}: "${result.text}"`);
                    try {
                        // Append the user transcript to conversation
                        session.conversation[session.conversation.length - 1].candidateAnswer = result.text;

                        // Persist to Firestore
                        await db.collection('interviews').doc(interviewId).update({
                            conversation: session.conversation
                        });

                        // Send user response to Gemini chat and get next question
                        console.time('Gemini response time');
                        const question = await generateNextQuestion(session.chat, result.text);
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
                    break;
                }

                default:
                    console.log(result);
            }
        });

        elevenLabsSTT.on("error", (err) => {
            console.error(`ElevenLabs error for interview ${interviewId}: `, err);
        });

        elevenLabsSTT.on("close", (code, reason) => {
            console.log(`ElevenLabs connection closed for interview ${interviewId}: ${code} - ${reason}`);
            console.log("Reason: ", { reason: reason.toString(), length: reason.length });
        });

        // Set up client messages (microphone stream)
        client.on("message", (message, isBinary) => {
            if (!isBinary) return;

            if (elevenLabsSTT.readyState !== WebSocket.OPEN) {
                // Buffer the chunk until the ElevenLabs socket is open
                session.audioQueue.push(message);
                return;
            }

            // Sending to ElevenLabs WebSocket to get transcript
            elevenLabsSTT.send(JSON.stringify({
                message_type: "input_audio_chunk",
                audio_base_64: message.toString("base64"),
                commit: false,
                sample_rate: 16000
            }));
        });

        // Handle client connection closing
        client.on("close", () => {
            console.log(`Client disconnected for interview ${interviewId}`);
            try {
                elevenLabsSTT.close();
            } catch (err) {
                console.error("Error closing ElevenLabs STT on client disconnect:", err);
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