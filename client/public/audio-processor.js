/* global AudioWorkletProcessor, registerProcessor */
class AudioProcessor extends AudioWorkletProcessor {

    process(inputs) {

        const input = inputs[0];

        if (!input || input.length === 0) {
            return true;
        }

        const channelData = input[0];

        if (!channelData) {
            return true;
        }

        // Copy Float32 samples
        this.port.postMessage(channelData.slice());

        return true;
    }

}

registerProcessor("audio-processor", AudioProcessor);