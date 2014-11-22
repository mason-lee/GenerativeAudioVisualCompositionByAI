window.audioContext = new AudioContext();

//	Creates echo
function createDelay() {
	var node = audioContext.createScriptProcessor(256, 2, 2);
	var del = 250*(44100/1000);
	
	var x = 0;
	var lBuf = [];
	var rBuf = [];
	node.onaudioprocess = function (e) {
		var lIn = e.inputBuffer.getChannelData(0);
		var rIn = e.inputBuffer.getChannelData(1);

		var lOut = e.outputBuffer.getChannelData(0);
		var rOut = e.outputBuffer.getChannelData(1);

		for (var i = 0; i < lIn.length; i++) {
			var l = lIn[i];
			var r = rIn[i];

			if (x >= del) {
				var lBufVal = lBuf.shift();
				var rBufVal = rBuf.shift();

				var lOld = l;
				var rOld = r;

				l = l + lBufVal*0.6;
				r = r + rBufVal*0.6;
			}

			lBuf.push(l);
			rBuf.push(r);

			lOut[i] = l;
			rOut[i] = r;

			x++;
		}
	};
	return node;
} 

/**
 * [TODO]
 *  Define different types of scale like A minor, C sharp something.....
 */
var major = [ 0, 2, 4, 5, 7, 9, 11, 12 ];

var scales = [
	// major
	[ 0, 2, 4, 5, 7, 9, 11, 12 ],
	// minor
	[ 0, 2, 3, 5, 7, 8, 10, 12 ],
	// harmonic minor
	[ 0, 2, 3, 5, 7, 8, 11, 12 ]

];

function pickScaleIndex() {
	return Math.floor(Math.random()*scales.length);
}

function pickSynthParameters() {
	return {
		a: Math.floor(200 * Math.random()),
		d: Math.floor(200 * Math.random()),
		s: Math.random(), // You figure out what to do here. Hint: the randomly generated value must be between 0 and 1.
		r: Math.floor(1000 * Math.random()), // You figure out what to do here. Hint: you want a value that is between 0 and 1000
		oscillatorIndex: Math.floor(Math.random() * scales.length) // You figure out what to do here. Hint: you want to clamp this value between 0 and the length of all possible oscillators
	}
}

function generateMelody(scaleIndex) {
	var notesLead = [];
	var scale = scales[scaleIndex];
	scale.forEach(function(semi, i) {
		var position = Math.floor(Math.random() * scale.length);
		
		notesLead.push({
			measure: Math.floor(position/16),
			// Every 1/16 of node
			start: (position % 16)/ 16,
			// A music is divided into 4 measures in western music
			duration: 1/ 16,
			tone: semi + 60 - 5
		});
	});
	// Put them in the order
	notesLead.sort(function(a, b) {
		return a.start - b.start;
	});
	return notesLead;
}

var delay = createDelay();
var reverb = audioContext.createConvolver();

// Create buffer source
var noiseBuffer = audioContext.createBuffer(2, audioContext.sampleRate/2, audioContext.sampleRate);
var left = noiseBuffer.getChannelData(0);
var right = noiseBuffer.getChannelData(1);
for (var i = 0; i < noiseBuffer.length; i++) {
	right[i] = left[i] = Math.random() * 2 - 1;
}
reverb.buffer = noiseBuffer;

function sinWave(x) {
	return Math.sin(x);
}

function sawToothWave(x) {
	x /= 10;
	return x - Math.floor(x);
}

function triangleWave(x) {
	// TODO: implement the triangle periodic function.
	// return m (x − x1) + y1
}

function squareWave(x) {
	// TODO: implement the square periodic function.
}

var waves = [
	sinWave,
	sawToothWave,
	triangleWave,
	squareWave
];

function leadSound(a, d, s, r, oscillatorIndex) {
	var random = Math.floor(Math.random() * waves.length);
	var wave = waves[oscillatorIndex];
	return function (note, time) {
		var val =
			440 * Math.pow(2, (note.tone - 36) / 12) * (time / 44100);
		var amp = synthastico.ampFromADSR(
			note.totalPlayed,
			//Maybe AI can determine what ideal oscillator is
			a*(audioContext.sampleRate / 1000),
			d*(audioContext.sampleRate / 1000),
			s,
			r*(audioContext.sampleRate / 1000)
		);
		return wave(val)*amp;
	}
}

delay.connect(audioContext.destination);







