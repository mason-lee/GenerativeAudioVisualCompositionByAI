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


$(".train-button").click(function() {
    $("#training-container").hide();
    $("#progress-box").show();

    // Call train
    setTimeout(function () {
        train();
    }, 1000);
});


function train() {
    var net = new brain.NeuralNetwork();
    var data = JSON.parse(localStorage.getItem("melodyLibrary"));
    // start counting down as soon as player presses train network
    // may need more
    net.train(data, {
        errorThresh: 0.005,  // error threshold to reach
        iterations: 10000,   // maximum training iterations
        // log: true,           // console.log() progress periodically
        // logPeriod: 10,       // number of iterations between logging
        learningRate: 0.3,    // learning rate
        callbackPeriod: 100,
        callback: function (info) {
            // Grab
            //   info.error, info.iterations / max iterations
            var completed = (info.iterations / 10000) * 100;
            $("#progress-completed").css("width", completed);
        }
    });
    
    var neurons = net.toJSON();
    jukebox(neurons);
}

function jukebox(neurons) {
    var net = new brain.NeuralNetwork();
    net.fromJSON(neurons);
    var MAX = 1000;
    var THETA_COEFF = Math.PI / MAX;
    var SCALE_INDEX_PHASE = Math.PI / 3; 
    var OSCILLATOR_INDEX_PHASE = Math.PI / 2;
    var A_PHASE = Math.PI / 4;
    var D_PHASE = Math.PI / 6;
    var S_PHASE = 3*Math.PI / 4;
    var R_PHASE = 3*Math.PI / 2;
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

    var likes = [];
    for (var i = 0; i < candidates.length; i++) {
        var candidate = candidates[i];
        var result = net.run(candidates[i]);
        if (result.like > result.dislike) {
            likes.push(candidate);
        }
    }

    // Now, we have a set of parameters that we think that the user will like.
    // Either play them sequentially, or shuffle them.
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
    }//End createParameters
    $("#progress-box").hide();
    $("#juke-box").show();
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
    $(".jukebox-play-icon-wrapper").click(function() {
        play();
        setInterval(play, 10000);
    });
}//End jukebox