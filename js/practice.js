// window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
// var n = window.audioContext.createOscillator();
// n.frequency.value = 440; // The A above middle C
// n.connect(window.audioContext.destination);

// var b = window.audioContext.createOscillator();
// b.frequency.value = 329.628;
// b.connect(window.audioContext.destination);

// var c = window.audioContext.createOscillator();
// c.frequency.value = 261.626;
// c.connect(window.audioContext.destination);

// n.noteOn(window.audioContext.currentTime);
// n.noteOff(window.audioContext.currentTime + 0.25);

// b.noteOn(window.audioContext.currentTime + 0.5);
// b.noteOff(window.audioContext.currentTime + 0.75);

// c.noteOn(window.audioContext.currentTime + 1.0);
// c.noteOff(window.audioContext.currentTime + 1.25);

var oscillator = window.audioContext.createOscillator();
var gain = window.audioContext.createGain();
gain.gain.value = 0;

oscillator.connect(gain);
gain.connect(window.audioContext.destination);
oscillator.noteOn(0);