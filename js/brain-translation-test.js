/*
$(document).ready(function(){
    trainer.changeTune();
    $(".test-box").hide();
});

var signal = {

    function soundSourceInfo{
        return { synth, a, d, s, r, scale };
    }
}

var trainer = {


    data : [],

    function  pickSound(){
        var result = {input: signal.soundSourceInfo),
                    output: { }};
        this.data.push(result);

    this.changeTune();

    if (this.data.length == 5){
        $('.test-box').show();
    }
}

function changeTune(){

}

function trainNetwork(){
    if(window.Worker){
        var worker = new Worker("audio-worker.js");
        worker.onmessage = this.onMessage;
        worker.onerror = this.onError;
        worker.postMessage(JSON.stringify(this.data));
        }
        else{
            var net = new brain.NeuralNetwork();
            net.train(this.data,{
                iterations: 1000
            });
        }
    },

    function onMessage(event){
        var data = JSON.parse(event.data);
        if (data.type == 'progress'){
            trainer.showProgress(data);
        }
        else if(data.type == 'result'){
            var net = brain.NeuralNetwork().fromJSON(data.net);
            tester.show(net);
        }
    },

    function onError(event){
        $(".training-message").text("error training network: " + event.message);
    },

    function showProgress(progress){
        var completed = progress.iterations / trainer.iterations * 100;
        $('.progress-completed').css("width, completed + %");
    }
}

var tester = {
    function show(net){
        $(".progress-box").hide();
        runNetwork = net.toFunction();
        runNetwork.name = "runNetwork";
        this.testRandom();
        $(".test-box").show();
    }
}

*/

