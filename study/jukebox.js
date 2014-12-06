var neurons = {"layers":[{"scaleIndex":{},"a":{},"d":{},"s":{},"r":{},"oscillatorIndex":{}},{"0":{"bias":-119.60146232010365,"weights":{"scaleIndex":30.041868040799773,"a":104.15130905467973,"d":-158.03497846262582,"s":49.06852192310346,"r":21.25614996074633,"oscillatorIndex":68.46297597806851}},"1":{"bias":-82.79130141259364,"weights":{"scaleIndex":-66.25514558389487,"a":-91.18891533035958,"d":173.94374010089444,"s":-34.57512233421066,"r":-127.37097671326569,"oscillatorIndex":163.8352282342111}},"2":{"bias":34.65190197409317,"weights":{"scaleIndex":-3.8643416858527107,"a":-4.98095334989798,"d":-2.389466353898796,"s":2.5674954396523044,"r":-3.2834904201774306,"oscillatorIndex":-131.671113866126}}},{"like":{"bias":-1.1585576998957716,"weights":{"0":4.014027110135025,"1":2.2028484664953996,"2":25.04928880448737}},"dislike":{"bias":1.1585576998957716,"weights":{"0":-4.014027110135025,"1":-2.2028484664954,"2":-25.049288804487468}}}],"outputLookup":true,"inputLookup":true}
// This is your neural network. You train it with the JSON data. I'll leave it
// to you to figure that out.
var net = new brain.NeuralNetwork();
net.fromJSON(neurons);

var MAX = 1000;
var THETA_COEFF = Math.PI / MAX;
var SCALE_INDEX_PHASE = Math.PI / 3; // Set it to a value that you want.
var OSCILLATOR_INDEX_PHASE = Math.PI / 2; // Set it to a value that you want.
var A_PHASE = Math.PI / 4; // Set it to a value that you want.
var D_PHASE = Math.PI / 6; // Set it to a value that you want.
var S_PHASE = 3*Math.PI / 4; // Set it to a value that you want.
var R_PHASE = 3*Math.PI / 2; // Set it to a value that you want.
var A_PERIOD = 0.5;
var D_PERIOD = 0.25;
var S_PERIOD = 3;
var R_PERIOD = 1.5;
 
// This is where all our candidate parameters will be.
var candidates = [];
 for (var i = 0; i < MAX; i++) {
    candidates.push({
        scaleIndex: (Math.sin(i*THETA_COEFF + SCALE_INDEX_PHASE) + 1)/2,
        a: (Math.sin(i*THETA_COEFF*A_PERIOD + A_PHASE) + 1) / 2,
        d: (Math.sin(i*THETA_COEFF*D_PERIOD + D_PHASE) + 1) / 2,
        s: (Math.sin(i*THETA_COEFF*S_PERIOD + S_PHASE) + 1) / 2,
        r: (Math.sin(i*THETA_COEFF*R_PERIOD + R_PHASE) + 1) / 2,
        oscillatorIndex: (Math.sin(i*THETA_COEFF + OSCILLATOR_INDEX_PHASE) + 1) / 2
    })
}

// console.log(candidates[0]);
 
var likes = [];
for (var i = 0; i < candidates.length; i++) {
    var candidate = candidates[i];
    var result = net.run(candidates[i]);
    if (result.like > 0.999999999) {
        likes.push(candidate);
    }
}

// Now, we have a set of parameters that we think that the user will like.
// Either play them sequentially, or shuffle them.

////////////////////////////////////////////////////////////////////////////////

// Here, we are going to loop through each melody at every 30 seconds.
var audioContext = new AudioContext();
var lead;

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

function playSong() {
    // We're going to pick a random parameter from the set of parameters that the
    // artificial intelligence engine believes that the user will like.
    var index = Math.floor(Math.random() * likes.length);
    var parameters = createParameters(likes[index]);

    var notesLead = generateMelody(parameters.scaleIndex);
    lead = synthastico.createSynth(audioContext, notesLead);
    lead.sound = leadSound(
        parameters.a,
        parameters.d,
        parameters.s,
        parameters.r,
        parameters.oscillatorIndex
    );
    lead.connect(audioContext.destination);
}

function stopSong() {
    if (lead) { lead.disconnect(); }
}

function play() {
    stopSong();
    playSong();
}

play();

setInterval(play, 30000)