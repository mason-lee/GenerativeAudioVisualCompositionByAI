var lead;
/*
	Stop the melody being played
 */

    var notesLead = generateMelody();
           var test = synthastico.createSynth(
                audioContext, notesLead
            );
$(".stop-button").click(function() {
    test.disconnect();
});

/*
    Play the new melody
 */
<<<<<<< HEAD
 
$(".play-button").click(function() {
	var notesLead = generateMelody();
      // AudioContext and List of nodes
      lead = synthastico.createSynth(audioContext, notesLead);
      lead.sound = leadSound();
      lead.connect(audioContext.destination);
});
=======
$(".play-button").click(function() {

           test.sound = function (note, time) {
                var val =
                    440 * Math.pow(2, (note.tone - 36) / 12) * (time / 48000);

                var amp = synthastico.ampFromADSR(
                    note.totalPlayed,
                    50*(48000 / 1000),
                    50*(48000 / 1000),
                    1,
                    1000*(48000 / 1000)
                )
                return Math.sin(val)*amp;
            }
    test.connect(delay);
        delay.connect(audioContext.destination);
});

/*


>>>>>>> 4f840671bf68d3604d75a77279bb15fc824242f4
