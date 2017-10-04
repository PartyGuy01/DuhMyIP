/*
Copyright (c) 2014 - 2017 David Meyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Config Vars
var img1 = "img/special.png";
var img2 = "img/special2.png";
var imgElement = "awesome"; // The element id for the title image.
var audioElement = "playitagain";
var titleSound = "sounds/duh.mp3";
var dir = "sounds/"; // The directory of all the audio clips.
var ext = ".mp3";
var takes = 3; // There are 3 takes for each audio clip.

// Instance Vars
var ip = ""; 
var sounds = new Array();
var curSound = null;
var START_POINT = -1;
var END_POINT = -1;

/*
* The main init function, called upon ip retrieval 
*/
function main(json) {
    // Getting the IP
    ip = json.ip; //".0123456789"
    END_POINT = ip.length;
    
    // Set up sounds 0 - 9
    for (var i = 0; i <= 9; i++) {
        // Nested array for random sounds 1 - 3
        sounds[i.toString()] = new Array(); 
        for (var j = 1; j <= takes; j++) { // Add random sounds 1 - 3 for this digit
            sounds[i.toString()][j] = dir + i + "-" + j + ext;
        }   
    }
    
    // Set up special char sounds
    sounds['.'] = new Array();
    sounds['starting'] = new Array();
    sounds['ending'] = new Array();

    for (var i = 1; i <= takes; i++) {
        sounds['.'][i] = dir + "dot-" + i + ext;
        sounds['starting'][i] = dir + "starting-" + i + ext;
        sounds['ending'][i] = dir + "ending-" + i + ext;
    }
}

function playAudio(src, onend) {
    var audio = document.getElementById(audioElement);
    audio.src = src;
    audio.play();
    audio.onended = function() {
        onend();
    };
}

/*
* This function increments through the IP and plays the random associated sounds.
*/
function playIP(i) {
    // If past all the chars in IP, we're done.
    if (i > END_POINT) return;
    
    // Randomly selected sound file number.
    var rand = Math.floor(Math.random() * takes) + 1;
    
    if (i == START_POINT) { // If we are starting from the beginning, play start sound.
        curSound = sounds['starting'][rand];
    } else if (i == END_POINT) { // We're now at the end.
        curSound = sounds['ending'][rand];
        switchImg(false);
    } else { // Else we're just strolling through the middle of the IP.
        curSound = sounds[ip.charAt(i)][rand];
    }
    
    playAudio(curSound, playIP.bind(null, i+1));
}

/*
* Switches the two title images.
*/
function switchImg(playing) {
    document.getElementById(imgElement).src = (playing) ? img2 : img1;
}

/*
* Plays the title sound of the page.
*/
function playTitleSound() {
    // Is sound already playing? If so, get out of here!
    if (curSound != null && !curSound.ended) return;
        
    switchImg(true);
    
    playAudio(titleSound, switchImg.bind(null, false));
}

/*
* Basically the main function. Defines itself.
*/
function onButtonClick() {
    // Is sound already playing? If so, get out of here!
    if (curSound != null && !curSound.ended) return;
    
    switchImg(true);
    
    // Play the IP sound!
    playIP(START_POINT);
}
