import WebSocket from "ws";
import { db } from "../config/firebaseAdmin.js";
import { streamTTS } from "./generatingAudio.js";
import { generateNextQuestion } from "./processInterview_ws.js";
import { sessions } from "./sessionManager.js";

export function connectToDeepgram(session) {
    const { interviewId, client, startTime, duration } = session;

    const deepgramSTT = new WebSocket(
        process.env.DEEPGRAM_STT_URI,
        {
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`
            }
        }
    );

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

                    // Close Deepgram
                    try {
                        deepgramSTT.close();
                    } catch (err) {
                        console.error("Error closing Deepgram STT on timeout:", err);
                    }

                    // Clean up
                    sessions.delete(interviewId);
                    return;
                }
                
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

    return deepgramSTT;
}
