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