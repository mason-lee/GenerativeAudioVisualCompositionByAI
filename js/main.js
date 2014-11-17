// Create AudioContext
var audioContext = new AudioContext();

/*
	Creates echo
 */
function createDelay() {
	// Create a ScriptProcessorNode with a bufferSize of 256
	// and a double input and output channel.
	// This value(256) controls how frequently the audioprocess event
	// is dispatched and how many sample-frames need to be processed each call.
	/*
		Q1. Why double? What does it mean?
	 */
	var node = audioContext.createScriptProcessor(256, 2, 2);

	var del = 250*(48000/1000);
	// console.log(del);

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

					// if (x > del && x < del + 256) { console.log('Weird'); }
				// if (isNaN(l) && isNaN(r)) {
				//   l = lOld;
				//   r = rOld;
				// }
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


function generateMelody() {
	var notesLead = [];

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

var notesLead = generateMelody();
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

// var lead = synthastico.createSynth(
// 	audioContext, notesLead
// );

// lead.sound = function (note, time) {
// 	var val =
// 		440 * Math.pow(2, (note.tone - 36) / 12) * (time / 48000);

// 	var amp = synthastico.ampFromADSR(
// 		note.totalPlayed,

// 			Maybe AI can determine what ideal oscillator is?

// 		50*(48000 / 1000),
// 		50*(48000 / 1000),
// 		1,
// 		1000*(48000 / 1000)
// 	)

// 	// return (val - Math.floor(val)) * amp;
// 	return Math.sin(val)*amp;
// }

// lead.connect(delay);
// // delay.connect(reverb);
// delay.connect(audioContext.destination);







