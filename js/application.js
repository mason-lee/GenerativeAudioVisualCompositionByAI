var lead;
/*
    Stop the melody being played
 */
$(".stop-button").click(function() {
    test.disconnect();
});

/*
    Play the new melody
 */
$(".play-button").click(function() {
    var notesLead = generateMelody();
      // AudioContext and List of nodes
      lead = synthastico.createSynth(audioContext, notesLead);
      lead.sound = leadSound();
      lead.connect(audioContext.destination);
});
