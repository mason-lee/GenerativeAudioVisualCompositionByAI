$(document).ready(function(){
    // trainer.changeTune();
    $(".test-box").hide();
});

var utils = {
    randomSound: function soundSourceInfo() {
        // return { synth, a, d, s, r, scale }
        return true;
    }
};

var trainer = {
    currentSound: utils.randomSound(),

    data : [],
    pickSound: function() {
        var result = {
            // input: ,
            // output: { }
        }

    this.data.push(result);

    this.changeSound();

    /*
        Show the "Train network" button after a user has
        selected a few entries.
     */
    if (this.data.length == 3) {
        $(".test-box").show();
    }
},

    changeSound: function() {
        this.currentSound = utils.randomSound();

    },


    trainNetwork : function() {
        $(".training-box").hide();
        // $("#progress-box").show();

        if(window.Worker) {
            // var worker = new Worker("training-worker.js");
            // worker.onmessage = this.onMessage;
            // worker.onerror = this.onError;
            // worker.postMessage(JSON.stringify(this.data));
        }
        else {
            var net = new brain.NeuralNetwork();
            net.train(this.data, {
                iterations: 9000
            });
            tester.show(net);
        }
    }
};

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
};

