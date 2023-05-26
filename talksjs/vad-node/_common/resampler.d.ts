interface ResamplerOptions {
    nativeSampleRate: number;
    targetSampleRate: number;
    targetFrameSize: number;
}
export declare class Resampler {
    options: ResamplerOptions;
    inputBuffer: Array<number>;
    constructor(options: ResamplerOptions);
    process: (audioFrame: Float32Array) => Float32Array[];
}
export {};
//# sourceMappingURL=resampler.d.ts.map