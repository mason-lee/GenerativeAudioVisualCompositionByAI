var A = 200;
var D = 200;
var R = 1000;
var SCALEINDEX = 9;
var OSCILLATORINDEX = 4;

// Copied from main.js
var scales = [
    // major
    [ 0, 2, 4, 5, 7, 9, 11, 12 ],
    // minor
    [ 0, 2, 3, 5, 7, 8, 10, 12 ],
    // harmonic minor
    [ 0, 2, 3, 5, 7, 8, 11, 12 ],
    // harmonic major
    [ 0, 1, 4, 5, 7, 9, 11, 12 ],
    // blues scale
    [ 0, 3, 5, 6, 7, 10, 12 ],
    // lydian augmented scales
    [ 0, 2, 4, 6, 8, 9, 11, 12 ],
    // neapolitan major scale
    [ 0, 1, 3, 5, 7, 9, 11, 12 ],
    // neapolitan minor scale
    [ 0, 1, 3, 5, 7, 8, 11, 12 ],
    // major locrian scale
    [ 0, 2, 4, 5, 6, 8, 10, 12 ]
];

function sinWave(x) {
    return Math.sin(x);
}

function sawToothWave(x) {
    x /= 10;
    return x - Math.floor(x);
}

function triangleWave(x) {
    return (Math.abs(( x % 6 ) - 3 ) - 1.5) / 1.5;
}

function squareWave(x) {
    return ( x % 6 ) < 3 ? 1 : -1;
}

var waves = [
    sinWave,
    sawToothWave,
    triangleWave,
    squareWave
];


