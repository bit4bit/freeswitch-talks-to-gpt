"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAgnosticNonRealTimeVAD = exports.defaultNonRealTimeVADOptions = void 0;
const frame_processor_1 = require("./frame-processor");
const messages_1 = require("./messages");
const models_1 = require("./models");
const resampler_1 = require("./resampler");
exports.defaultNonRealTimeVADOptions = {
    ...frame_processor_1.defaultFrameProcessorOptions,
};
class PlatformAgnosticNonRealTimeVAD {
    static async _new(modelFetcher, ort, options = {}) {
        const vad = new this(modelFetcher, ort, {
            ...exports.defaultNonRealTimeVADOptions,
            ...options,
        });
        await vad.init();
        return vad;
    }
    constructor(modelFetcher, ort, options) {
        this.modelFetcher = modelFetcher;
        this.ort = ort;
        this.options = options;
        this.init = async () => {
            const model = await models_1.Silero.new(this.ort, this.modelFetcher);
            this.frameProcessor = new frame_processor_1.FrameProcessor(model.process, model.reset_state, {
                frameSamples: this.options.frameSamples,
                positiveSpeechThreshold: this.options.positiveSpeechThreshold,
                negativeSpeechThreshold: this.options.negativeSpeechThreshold,
                redemptionFrames: this.options.redemptionFrames,
                preSpeechPadFrames: this.options.preSpeechPadFrames,
                minSpeechFrames: this.options.minSpeechFrames,
            });
            this.frameProcessor.resume();
        };
        this.run = async function* (inputAudio, sampleRate) {
            const resamplerOptions = {
                nativeSampleRate: sampleRate,
                targetSampleRate: 16000,
                targetFrameSize: this.options.frameSamples,
            };
            const resampler = new resampler_1.Resampler(resamplerOptions);
            const frames = resampler.process(inputAudio);
            let start, end;
            for (const i of [...Array(frames.length)].keys()) {
                const f = frames[i];
                const { msg, audio } = await this.frameProcessor.process(f);
                switch (msg) {
                    case messages_1.Message.SpeechStart:
                        start = (i * this.options.frameSamples) / 16;
                        break;
                    case messages_1.Message.SpeechEnd:
                        end = ((i + 1) * this.options.frameSamples) / 16;
                        // @ts-ignore
                        yield { audio, start, end };
                        break;
                    default:
                        break;
                }
            }
            const { msg, audio } = this.frameProcessor.endSegment();
            if (msg == messages_1.Message.SpeechEnd) {
                yield {
                    audio,
                    // @ts-ignore
                    start,
                    end: (frames.length * this.options.frameSamples) / 16,
                };
            }
        };
        (0, frame_processor_1.validateOptions)(options);
    }
}
exports.PlatformAgnosticNonRealTimeVAD = PlatformAgnosticNonRealTimeVAD;
//# sourceMappingURL=non-real-time-vad.js.map