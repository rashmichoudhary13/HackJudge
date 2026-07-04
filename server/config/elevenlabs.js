import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_VOICE_API_KEY
});