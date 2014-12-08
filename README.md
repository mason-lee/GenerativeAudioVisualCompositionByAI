### Using Neural Network to generate a best melody
##### IAT455 Final Project - Jukebox

Abstract

The jukebox system generates a variety of melodies for users to listen to and select whether or not they liked it. The liked ones are stored inside a JSON file to be trained using a neural network. The system then selects parameters from the JSON list and plays the melodies back.


Jukebox

The parameters for generating music are based on semitone scales - Wavelength alterations were applied to them as well - Attack, Decay, Sustain, Release synthesis and oscillation. These values are parsed in JSON and retrieved during the neural network's training process.

Our Artificial Intelligence topic is Artificial Neural Network; a system comprised of interconnected elements and processes information based on the input's state changes. Under normal circumstances a neural network consists of three layers: the input, hidden and the output layers. Jukebox only uses the input and output layer due to the simplicity of its structure. The input values in this system are the scaleIndex, ADSR and oscillation. They are all stored in the synth.json file.

The system learns the user's input over time and determines what type of melody is good. This training stage was predetermined by our JSON values and by their choices. Clicking on the train neural network button in the UI triggers the learining process which adds the users feedback to the iterations.

Jukebox uses the libraries audio.js for audio generation, brain.js for the neural network, store.js for storage of JSON values and bootstrap for the user interface. 

Major drawbacks of using a neural network include the time it takes to train itself as well as the time used to compute the values.

Future iterations will include developing web worker compatibility to reduce the loading time and mainly to stop the system from freezing the UI. 




