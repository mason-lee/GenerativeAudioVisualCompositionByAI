window.audioContext = new AudioContext();
//  Creates echo
function createDelay() {
    var node = audioContext.createScriptProcessor(256, 2, 2);
    var del = 250*(48000/1000);
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

function leadSound(a, d, s, r, oscillatorIndex) {
  var random = Math.floor(Math.random() * waves.length);
  var wave = waves[oscillatorIndex];
  return function (note, time) {
    var val =
      440 * Math.pow(2, (note.tone - 36) / 12) * (time / 48000);
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