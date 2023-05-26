const vad = require('@ricky0123/vad-node');

function int16ToFloat32(inputArray) {
    const buffer = Buffer.from(inputArray)
    var output = new Float32Array(inputArray.length/2);
    for (var i = 0; i < inputArray.length; i += 2) {
	const sample = buffer.readInt16LE(i);
	const floatSample = sample / 32768.0;
	output[i / 2] = floatSample;
    }
    return output;
}    

exports.sentenceDetector = async function (silence, detectedFn) {
    let wsInterval = null;
    let speechEndAt = null;
    let onEnd = false;
    
    setInterval(() => {
	if (!speechEndAt) return;
	if (!onEnd) return;
	
	const diff = (new Date()) - speechEndAt;
	if (diff > silence) {
	    detectedFn();
	    onEnd = false;
	}
    }, 1000);

    const myvad = await vad.RealTimeVAD.new(16000, {
	onFrameProcessed: (probabilities) => { 
	    //console.log("Frame processed",probabilities)
        },
        onVADMisfire: () => {
        },
        onSpeechStart: () => {
	    onEnd = false;
        },
        onSpeechEnd: () => {
	    speechEndAt = new Date();
	    onEnd = true;
	}
    });

    return {
	processAudio(buffer) {
	    return myvad.processAudio(int16ToFloat32(buffer));
	}
    }
}

