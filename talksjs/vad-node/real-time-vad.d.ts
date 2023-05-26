import { SpeechProbabilities } from "./_common/models";
import { FrameProcessor, FrameProcessorOptions } from "./_common/frame-processor";
import { Resampler } from "./_common/resampler";
interface RealTimeVADCallbacks {
    /** Callback to run after each frame. The size (number of samples) of a frame is given by `frameSamples`. */
    onFrameProcessed: (probabilities: SpeechProbabilities) => any;
    /** Callback to run if speech start was detected but `onSpeechEnd` will not be run because the
     * audio segment is smaller than `minSpeechFrames`.
     */
    onVADMisfire: () => any;
    /** Callback to run when speech start is detected */
    onSpeechStart: () => any;
    /**
     * Callback to run when speech end is detected.
     * Takes as arg a Float32Array of audio samples between -1 and 1, sample rate 16000.
     * This will not run if the audio segment is smaller than `minSpeechFrames`.
     */
    onSpeechEnd: (audio: Float32Array) => any;
}
interface RealTimeVADOptions extends FrameProcessorOptions, RealTimeVADCallbacks {
}
export declare class RealTimeVAD {
    inputSampleRate: number;
    options: RealTimeVADOptions;
    frameProcessor: FrameProcessor;
    resampler: Resampler;
    static new(inputSampleRate: number, options?: Partial<RealTimeVADOptions>): Promise<RealTimeVAD>;
    constructor(inputSampleRate: number, options: RealTimeVADOptions);
    init: () => Promise<void>;
    processAudio: (audio: Float32Array) => Promise<void>;
}
export {};
//# sourceMappingURL=real-time-vad.d.ts.map