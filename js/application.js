$(function() {
	var lead;
	var play = false;

	$(document).on('click', ".play-icon", function() {
		play = true;
		if(play) {
			var notesLead = generateMelody();
		      // AudioContext and List of nodes
		      lead = synthastico.createSynth(audioContext, notesLead);
		      lead.sound = leadSound();
		      lead.connect(audioContext.destination);

			$(this).parent().append("<span class='glyphicon glyphicon-stop stop-icon'></span><span class='glyphicon-class stop-icon'>Stop</span>");
			$(".play-icon").remove();
		}
	});

	$(document).on('click', ".stop-icon", function() {
		play = false;
		if(!play) {
			// delay.disconnect();
			// delay.disconnect(audioContext.destination);
		  	$(this).parent().append("<span class='glyphicon glyphicon-play play-icon'></span><span class='glyphicon-class play-icon'>Play</span>");
		  	$(".stop-icon").remove();
		}
	});

	
	// Allow only one click
	$('.choose input[type="checkbox"]').on('change', function() {
		$('input[type="checkbox"]').not(this).prop('checked', false);
	});

	// Dynamically add question number
	$(".next-button").click(function() {
		// Only when checkbox is checked
		if($(".choose input[type='checkbox']").is(':checked')) {
			var qNum = parseInt($(".q-number").html());
			qNum++;
			$(".q-number").empty();
			$(".q-number").append(qNum);
		}
	});
	
})
