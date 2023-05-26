"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeVAD = void 0;
const models_1 = require("./_common/models");
const ort = __importStar(require("onnxruntime-node"));
const model_fetcher_1 = require("./model-fetcher");
const frame_processor_1 = require("./_common/frame-processor");
const resampler_1 = require("./_common/resampler");
const messages_1 = require("./_common/messages");
const logging_1 = require("./_common/logging");
const defaultRealTimeVADOptions = {
    onFrameProcessed: (probabilities) => { },
    onVADMisfire: () => {
        logging_1.log.debug("VAD misfire");
    },
    onSpeechStart: () => {
        logging_1.log.debug("Detected speech start");
    },
    onSpeechEnd: () => {
        logging_1.log.debug("Detected speech end");
    },
    ...frame_processor_1.defaultFrameProcessorOptions,
};
function validateOptions(options) { }
class RealTimeVAD {
    static async new(inputSampleRate, options = {}) {
        const vad = new RealTimeVAD(inputSampleRate, {
            ...defaultRealTimeVADOptions,
            ...options,
        });
        await vad.init();
        return vad;
    }
    constructor(inputSampleRate, options) {
        this.inputSampleRate = inputSampleRate;
        this.options = options;
        this.init = async () => {
            const model = await models_1.Silero.new(ort, model_fetcher_1.modelFetcher);
            this.frameProcessor = new frame_processor_1.FrameProcessor(model.process, model.reset_state, {
                frameSamples: this.options.frameSamples,
                positiveSpeechThreshold: this.options.positiveSpeechThreshold,
                negativeSpeechThreshold: this.options.negativeSpeechThreshold,
                redemptionFrames: this.options.redemptionFrames,
                preSpeechPadFrames: this.options.preSpeechPadFrames,
                minSpeechFrames: this.options.minSpeechFrames,
            });
            this.frameProcessor.resume();
            this.resampler = new resampler_1.Resampler({
                nativeSampleRate: this.inputSampleRate,
                targetSampleRate: 16000,
                targetFrameSize: this.options.frameSamples,
            });
        };
        this.processAudio = async (audio) => {
            const frames = this.resampler.process(audio);
            for (const frame of frames) {
                const { probs, msg, audio } = await this.frameProcessor.process(frame);
                if (probs !== undefined) {
                    this.options.onFrameProcessed(probs);
                }
                switch (msg) {
                    case messages_1.Message.SpeechStart:
                        this.options.onSpeechStart();
                        break;
                    case messages_1.Message.VADMisfire:
                        this.options.onVADMisfire();
                        break;
                    case messages_1.Message.SpeechEnd:
                        // @ts-ignore
                        this.options.onSpeechEnd(audio);
                        break;
                    default:
                        break;
                }
            }
        };
        validateOptions(options);
    }
}
exports.RealTimeVAD = RealTimeVAD;
//# sourceMappingURL=real-time-vad.js.map