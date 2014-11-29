var A = 200;
var D = 200;
var R = 1000;
var SCALEINDEX = 9;
var OSCILLATORINDEX = 4;

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

var scales = [
	// major
	[ 0, 2, 4, 5, 7, 9, 11, 12 ],
	// minor
	[ 0, 2, 3, 5, 7, 8, 10, 12 ],
	// harmonic minor
	[ 0, 2, 3, 5, 7, 8, 11, 12 ],
	// harmonic major
	[ 0, 1, 4, 5, 7, 9, 11, 12 ],
	// blues scale
	[ 0, 3, 5, 6, 7, 10, 12 ],
	// lydian augmented scales
	[ 0, 2, 4, 6, 8, 9, 11, 12 ],
	// neapolitan major scale
	[ 0, 1, 3, 5, 7, 9, 11, 12 ],
	// neapolitan minor scale
	[ 0, 1, 3, 5, 7, 8, 11, 12 ],
	// major locrian scale
	[ 0, 2, 4, 5, 6, 8, 10, 12 ]
];

function pickSynthParameters() {
	return {
		scaleIndex: Math.random(),
		a: Math.random(),
		d: Math.random(),
		s: Math.random(), 
		r: Math.random(), 
		oscillatorIndex: Math.random() 
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
	return (Math.abs(( x % 6 ) - 3 ) - 1.5) / 1.5;
}

function squareWave(x) {
	return ( x % 6 ) < 3 ? 1 : -1;
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
			a*(audioContext.sampleRate / 1000),
			d*(audioContext.sampleRate / 1000),
			s,
			r*(audioContext.sampleRate / 1000)
		);
		return wave(val)*amp;
	}
}

delay.connect(audioContext.destination);

/*********************** Application Script *********************************/
var lead;
var play = false;
var synth;

function createParameters(synthParams) {

	return {
		scaleIndex: Math.floor(synthParams.scaleIndex * scales.length),
		a: Math.floor(synthParams.a * A),
		d: Math.floor(synthParams.d * D),
		s: synthParams.s,
		r: Math.floor(synthParams.r * R),
		oscillatorIndex: Math.floor(synthParams.oscillatorIndex * waves.length)
	}
}

$(document).on('click', ".play-icon-wrapper", function() {
	play = true;
	if(play) {
		var params = pickSynthParameters();
		var synthParams = createParameters(params);
		var notesLead = generateMelody(synthParams.scaleIndex);
	      // AudioContext and List of nodes
	      lead = synthastico.createSynth(audioContext, notesLead);
	      lead.sound = leadSound(synthParams.a, synthParams.d, synthParams.s, synthParams.r, synthParams.oscillatorIndex);
	      lead.connect(audioContext.destination);
	      $(".stop-icon-wrapper").prop("disabled", false);
	      $(this).prop("disabled", true);
	      play = false;
		// Store input values to the melody variable which will be stored to localStorage later
		synth = params;
	}
});

$(document).on('click', ".stop-icon-wrapper", function() {
	play = false;
	if(!play) {
		lead.disconnect();
		$(this).prop("disabled", true);
	}
});

var melodySelection = undefined;
// Allow only one click and able next button only when a checkbox is clicked.
$('.choose input[type="checkbox"]').on('change', function() {
	$('input[type="checkbox"]').not(this).prop('checked', false);
	if(this.checked) {
      	$(".next-button").removeClass("inactive");
      	if($(this).prop('value') == "yes") {
			// Store oupt values to the melodySelection variable
			// which will be stored to localStorage as an ouput later
			melodySelection = {like : 1};
      	}
      	else if ($(this).prop('value') == "no") {
			// Store oupt values to the melodySelection variable 
			// which will be stored to localStorage as an ouput later
			melodySelection = {dislike: 1};
      	}
	}
	else {
		$(".next-button").addClass("inactive");
	}
});

var qNum = parseInt($(".q-number").html());
var library = store.get('melodyLibrary');
if(!library) { library = []; }

$(".test-box").hide();
// Dynamically add question number
$(".next-button").click(function() {
	// Only when checkbox is checked
	if($(".choose input[type='checkbox']").is(':checked')) {
		qNum++;
		$(".q-number").empty();
		$(".q-number").append(qNum);
		if(qNum > 5) {
			$(".test-box").show();
		}
		$(".next-button").addClass("inactive");
		$(".choose input[type='checkbox']").removeAttr("checked");
		// Stop the current melody
		lead.disconnect();
		$(".play-icon-wrapper").prop("disabled", false);
		

		// save the melody and outuput to the localStorage
		var data = { input: synth, output: melodySelection };
		// console.log(data);
		library.push(data);
		store.set('melodyLibrary', library);
		// console.log(library);
		/**
		 * Brain JS Thingy....
		 */
		
	}
	else {
		var errorMsg = $("<span class='bg-danger select-message'>Please select at least one melody.</span>");
		errorMsg.appendTo(".training-box").hide().fadeIn(500);
		$(".select-message").delay(2000).fadeOut(500);
	}
});


/*
	Plug this into jukebox
 */

// var net = new brain.NeuralNetwork();
		// net.train(library, {
		// 	errorThresh: 0.005,  // error threshold to reach
		// 	iterations: 20000,   // maximum training iterations
		// 	log: true,           // console.log() progress periodically
		// 	logPeriod: 10,       // number of iterations between logging
		// 	learningRate: 0.3    // learning rate
		// });




