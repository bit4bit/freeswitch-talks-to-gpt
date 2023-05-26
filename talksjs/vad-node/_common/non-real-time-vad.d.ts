import { FrameProcessorInterface, FrameProcessorOptions } from "./frame-processor";
import { ModelFetcher, ONNXRuntimeAPI } from "./models";
interface NonRealTimeVADSpeechData {
    audio: Float32Array;
    start: number;
    end: number;
}
export interface NonRealTimeVADOptions extends FrameProcessorOptions {
}
export declare const defaultNonRealTimeVADOptions: NonRealTimeVADOptions;
export declare class PlatformAgnosticNonRealTimeVAD {
    modelFetcher: ModelFetcher;
    ort: ONNXRuntimeAPI;
    options: NonRealTimeVADOptions;
    frameProcessor: FrameProcessorInterface | undefined;
    static _new<T extends PlatformAgnosticNonRealTimeVAD>(modelFetcher: ModelFetcher, ort: ONNXRuntimeAPI, options?: Partial<NonRealTimeVADOptions>): Promise<T>;
    constructor(modelFetcher: ModelFetcher, ort: ONNXRuntimeAPI, options: NonRealTimeVADOptions);
    init: () => Promise<void>;
    run: (inputAudio: Float32Array, sampleRate: number) => AsyncGenerator<NonRealTimeVADSpeechData>;
}
export {};
//# sourceMappingURL=non-real-time-vad.d.ts.map