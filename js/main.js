// Hide these two pages
$("#progress-box").hide();
$("#juke-box").hide();

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
            // Store output values to the melodySelection variable
            // which will be stored to localStorage as an output later
            melodySelection = {like : 1};
        }
        else if ($(this).prop('value') == "no") {
            // Store output values to the melodySelection variable
            // which will be stored to localStorage as an output later
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
        $(".stop-icon-wrapper").prop("disabled", false);
        // save the melody and outuput to the localStorage
        var data = { input: synth, output: melodySelection };
        // console.log(data);
        library.push(data);
        store.set('melodyLibrary', library);
        // console.log(library);
    }
    else {
        var errorMsg = $("<span class='bg-danger select-message'>Please select at least one melody.</span>");
        errorMsg.appendTo(".training-box").hide().fadeIn(500);
        $(".select-message").delay(2000).fadeOut(500);
    }
});


var synthsParams;

function loadSynths(callback) {
    $.getJSON("/synths.json", function(data) {
        callback(data);
    }).error(function(jqXhr, textStatus, error) {
        console.log("ERROR: " + textStatus + ", " + error);
    });
}

var net = new brain.NeuralNetwork();

$(".train-button").click(function() {
    $("#training-container").hide();
    $("#progress-box").show();
    // start counting down as soon as player presses train network
    // may need more
    loadSynths(function(data) {
    net.train(data, {
        errorThresh: 0.005,  // error threshold to reach
        iterations: 20000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 10,       // number of iterations between logging
        learningRate: 0.3    // learning rate
    });
    // Print neurons
    // console.log(JSON.stringify(net.toJSON()));
    var neurons = JSON.stringify(net.toJSON());
    tester.showProgress(net);
    //show play button
    tester.show();
    });
});

var jukeboxPlay = false;
$("jukebox-play-icon-wrapper").click(function(){
    jukeboxPlay = true;
    if (jukeboxPlay) {
        playSong();
        $(".stop-icon-wrapper").prop("disabled", false);
        $(this).prop("disabled", true);
        jukeboxPlay = false;
    }
});

 var tester = {
    show: function(net) {
        $("#progress-box").hide();
        // runNetwork = net.toFunction();
        // this.testRandom();
        $("#juke-box").show();
    },

    testMelody:function() {
        // Play the jukebox in the end.
    },
    //
     showProgress: function(progress){
            var completed = progress.iterations / loadSynths.iterations * 100;
            $("#progress-completed").css("width", completed + "%");
    }
}