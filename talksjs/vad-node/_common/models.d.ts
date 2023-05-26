export type ONNXRuntimeAPI = any;
export type ModelFetcher = () => Promise<ArrayBuffer>;
export interface SpeechProbabilities {
    notSpeech: number;
    isSpeech: number;
}
export interface Model {
    reset_state: () => void;
    process: (arr: Float32Array) => Promise<SpeechProbabilities>;
}
export declare class Silero {
    private ort;
    private modelFetcher;
    _session: any;
    _h: any;
    _c: any;
    _sr: any;
    constructor(ort: ONNXRuntimeAPI, modelFetcher: ModelFetcher);
    static new: (ort: ONNXRuntimeAPI, modelFetcher: ModelFetcher) => Promise<Silero>;
    init: () => Promise<void>;
    reset_state: () => void;
    process: (audioFrame: Float32Array) => Promise<SpeechProbabilities>;
}
//# sourceMappingURL=models.d.ts.map