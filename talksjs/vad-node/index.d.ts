import { utils, PlatformAgnosticNonRealTimeVAD, FrameProcessor, FrameProcessorOptions, Message, NonRealTimeVADOptions } from "./_common";
declare class NonRealTimeVAD extends PlatformAgnosticNonRealTimeVAD {
    static new(options?: Partial<NonRealTimeVADOptions>): Promise<NonRealTimeVAD>;
}
export { utils, FrameProcessor, Message, NonRealTimeVAD };
export type { FrameProcessorOptions, NonRealTimeVADOptions };
export { RealTimeVAD } from "./real-time-vad";
//# sourceMappingURL=index.d.ts.map