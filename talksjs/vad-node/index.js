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
exports.RealTimeVAD = exports.NonRealTimeVAD = exports.Message = exports.FrameProcessor = exports.utils = void 0;
const ort = __importStar(require("onnxruntime-node"));
const model_fetcher_1 = require("./model-fetcher");
const _common_1 = require("./_common");
Object.defineProperty(exports, "utils", { enumerable: true, get: function () { return _common_1.utils; } });
Object.defineProperty(exports, "FrameProcessor", { enumerable: true, get: function () { return _common_1.FrameProcessor; } });
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return _common_1.Message; } });
class NonRealTimeVAD extends _common_1.PlatformAgnosticNonRealTimeVAD {
    static async new(options = {}) {
        return await this._new(model_fetcher_1.modelFetcher, ort, options);
    }
}
exports.NonRealTimeVAD = NonRealTimeVAD;
var real_time_vad_1 = require("./real-time-vad");
Object.defineProperty(exports, "RealTimeVAD", { enumerable: true, get: function () { return real_time_vad_1.RealTimeVAD; } });
//# sourceMappingURL=index.js.map