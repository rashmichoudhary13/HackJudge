import { elevenlabs } from "../config/elevenlabs.js";

// Converting text into mp3 audio
async function generateAudio(question) {
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
        chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);
    const base64Audio = audioBuffer.toString("base64");

    return base64Audio;
}

export default generateAudio;