import WebSocket from "ws";
import { processInterview_ws } from "./processInterview_ws.js";
import generateAudio from "./generatingAudio.js";

export function setupSpeechToText(client, session) {
    const { interviewId, projectId, startTime, duration } = session;

    let eleven = null;
    const audioQueue = [];

    function connectEleven() {
        if (eleven && (eleven.readyState === WebSocket.OPEN || eleven.readyState === WebSocket.CONNECTING)) {
            return eleven;
        }

        console.log("Opening new ElevenLabs STT connection...");
        const socket = new WebSocket(
            process.env.ELEVENLAB_STT_URI,
            {
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_VOICE_API_KEY
                }
            }
        );
        eleven = socket;

        socket.on("open", () => {
            console.log("ElevenLabs connected");
            // Send all buffered chunks
            while (audioQueue.length > 0 && socket.readyState === WebSocket.OPEN) {
                const chunk = audioQueue.shift();
                socket.send(JSON.stringify({
                    message_type: "input_audio_chunk",
                    audio_base_64: chunk.toString("base64"),
                    commit: false,
                    sample_rate: 16000
                }));
            }
        });

        socket.on("message", async (data) => {
            console.log("Transcript: ", data.toString());
            const result = JSON.parse(data.toString());

            switch (result.message_type) {
                case "session_started":
                    console.log("Session started");
                    break;

                case "partial_transcript":
                    client.send(JSON.stringify({
                        type: "partial_transcript",
                        text: result.text
                    }));
                    break;

                case "committed_transcript": {
                    client.send(JSON.stringify({
                        type: "committed_transcript",
                        text: result.text,
                    }));

                    // Close the ElevenLabs socket while generating the next question to prevent inactivity timeout
                    if (eleven === socket) {
                        eleven = null;
                    }
                    socket.close();

                    const elapsed = Date.now() - startTime;

                    if (elapsed >= duration) {
                        const audio = await generateAudio("We've reached the end of the interview. Thank you for your presentation.");
                        client.send(JSON.stringify({
                            type: "interview_end",
                            audio
                        }));
                        return;
                    }

                    console.log("generating function");
                    try {
                        const question = await processInterview_ws({
                            interviewId,
                            projectId,
                            answer: result.text
                        });

                        const audio = await generateAudio(question);

                        console.log("sending next question to frontend");
                        client.send(JSON.stringify({
                            type: "question",
                            question,
                            audio
                        }));
                    } catch (err) {
                        console.log("Generating next question error: ", err);
                        client.send(JSON.stringify({
                            type: "error",
                            message: "Unable to generate the next question. Please try again."
                        }));
                    }
                    break;
                }

                default:
                    console.log(result);
            }
        });

        socket.on("error", (err) => {
            console.error("elevenlab error: ", err);
        });

        socket.on("close", (code, reason) => {
            console.log(`ElevenLabs connection closed: ${code} - ${reason}`);
            if (eleven === socket) {
                eleven = null;
            }
        });

        return socket;
    }

    client.on("message", (message, isBinary) => {
        if (!isBinary) return;

        const currentEleven = connectEleven();

        if (currentEleven.readyState !== WebSocket.OPEN) {
            // Buffer the chunk until the socket is open
            audioQueue.push(message);
            return;
        }

        // Sending to eleven websocket to get transcript
        currentEleven.send(JSON.stringify({
            message_type: "input_audio_chunk",
            audio_base_64: message.toString("base64"),
            commit: false,
            sample_rate: 16000
        }));
    });

    client.on("close", () => {
        if (eleven) {
            eleven.close();
            eleven = null;
        }
    });
}