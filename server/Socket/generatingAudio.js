import { elevenlabs } from "../config/elevenlabs.js";

// Converting text into mp3 audio
async function generateAudio(question) {

    console.time('generating audio');
    const audioStream = await elevenlabs.textToSpeech.convert(
        process.env.ELEVENLABS_VOICE_ID,
        {
            text: question,
            model_id: "eleven_flash_v2_5",
            output_format: "mp3_44100_128"
        }
    );

    const chunks = [];

    for await (const chunk of audioStream) {
        if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
        }
    }

    if (chunks.length === 0) {
        throw new Error("No binary audio chunks returned from ElevenLabs");
    }

    // Buffer is a way of storing raw binary data
    const audioBuffer = Buffer.concat(chunks);
    const base64Audio = audioBuffer.toString("base64");

    console.timeEnd('generating audio');

    return base64Audio;
}

export async function streamTTS(text, client) {
    try {
        console.time('streaming audio');
        const audioStream = await elevenlabs.textToSpeech.convert(
            process.env.ELEVENLABS_VOICE_ID,
            {
                text: text,
                model_id: "eleven_flash_v2_5",
                output_format: "mp3_44100_128"
            }
        );

        for await (const chunk of audioStream) {
            if (client.readyState === 1 && (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))) { // WebSocket.OPEN is 1
                client.send(JSON.stringify({
                    type: "audio_chunk",
                    audio: Buffer.from(chunk).toString("base64")
                }));
            }
        }

        if (client.readyState === 1) {
            client.send(JSON.stringify({
                type: "audio_end"
            }));
        }
        console.timeEnd('streaming audio');
    } catch (err) {
        console.error("Error streaming TTS: ", err);
        if (client.readyState === 1) {
            client.send(JSON.stringify({
                type: "audio_end"
            }));
        }
    }
}

export default generateAudio;