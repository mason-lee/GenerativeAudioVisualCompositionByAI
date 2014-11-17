window.audioContext = new AudioContext();

/*
	Creates echo
 */
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

/*
	1. square
	2 . sine
	3. triangle
	4. sawtooth wave
 */

/**
 * [TODO]
 *  Define different types of scale like A minor, C sharp something.....
 */
var major = [ 0, 2, 4, 5, 7, 9, 11, 12 ];
>>>>>>> 4f840671bf68d3604d75a77279bb15fc824242f4

var scales = [
	// major
	[ 0, 2, 4, 5, 7, 9, 11, 12 ],
	// minor
	[ 0, 2, 3, 5, 7, 8, 10, 12 ],
	// harmonic minor
	[ 0, 2, 3, 5, 7, 8, 11, 12 ]
];

function generateMelody() {
	var notesLead = [];
	var scale = scales[Math.floor(Math.random()*scales.length)];

	scale.forEach(function(semi, i) {
		var position = Math.floor(Math.random() * scale.length);

	major.forEach(function(semi, i) {
		var position = Math.floor(Math.random() * major.length);

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

// var notesLead = generateMelody();
var delay = createDelay();
var reverb = audioContext.createConvolver();

// Create buffer source
var noiseBuffer = audioContext.createBuffer(2, 48000/2, 48000);
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

var waves = [sinWave, sawToothWave];

function leadSound() {
	var random = Math.floor(Math.random() * waves.length);
	var wave = waves[random];
	return function (note, time) {
		var val =
			440 * Math.pow(2, (note.tone - 36) / 12) * (time / 44100);
		var amp = synthastico.ampFromADSR(
			note.totalPlayed,
			/*
				Maybe AI can determine what ideal oscillator is?
			 */
			50*(44100 / 1000),
			50*(44100 / 1000),
			1,
			1000*(44100 / 1000)
		);
		// return (val - Math.floor(val)) * amp;
		return wave(val)*amp;
	}
}


delay.connect(audioContext.destination);







