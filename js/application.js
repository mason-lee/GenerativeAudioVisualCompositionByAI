/*
	Stop the melody being played
 */

$(".stop-button").click(function() {
	lead.disconnect();
});

/*
	Play the new melody
 */
// $(".play-button").click(function() {
// 	var notesLead = generateMelody();
// 	notesLead.connect(delay);
// });

/*
	
 