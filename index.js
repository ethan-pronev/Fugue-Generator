/*STUFF TO DO:
- probably remove half notes from top voice
- for middle voice, do slower note values (ie. include half notes, maybe no e,e,e,e)
- define each key low, mid, high arrays with some overlap
- experiment with randomly choosing notes (instead of random note <2 away, maybe do more likely the closer)
maybe have option where for any e,e,e,e have it more likely to do a certain pattern (ie. upward arpeggio),
or for half note, have it more likely to do tonic note*/

/*VOICES:
voice-low={
	C:["C2","E2","G2","C3",...]
	Cm:["C2","Eb2","G2","C3",...]
	C#:
	C#m:
	D:
	Dm:
	...
}
same with voice-mid and voice-high
maybe do both sharp and flat (same notes, just able to use either when building structure)
registers will probably be 2 octaves inclusive, with a 1 octave overlap (eg. C2->C4,C3->C5,C4->C6)
*/

/*THEMES:
2-d array of different pre-set themes
theme[i][j] is theme #i, where j=[{index,note-val},{index,note-val},...]
index is the position of the note in the specified register/voice
A specific theme can be selected for a specific voice on a specific current key
 - will play for the duration of the key
 - if too short, theme will loop back to start
 - if too long, theme will be cut off
  - theme of index 0 - no theme, random notes
*/

/*STRUCTURE:
1-d array containing all the keys the piece will progress through, the duration of each key (# of beats),
and the theme for the key
if theme index is -1 it means that voice shouldn't play for that key
structure=[{"key":"C#","length":16,"theme-low":1,"theme-mid":0,"theme-high":0},
		   {"key":"Bbm","length":4,"theme-low":0,"theme-mid":2,"theme-high":1}, ... ]
*/

/*LAST NOTES:
last-note-low, last-note-mid, last-note-high keep track of the last note that was played in each register
as an index of the register array
Used for any sections of random note generation to have consecutive notes close to each other (+- 2 indices)
*/

/*RHYTHMS:
used for randome note sections
rythms of length 1 and 2 beats depending on length of random note section
for lengths longer than 2 beats, fill up with 2 beat rhythms and possibly add on a 1 beat to the end
rhythms[1]=["4"],[],[]
rhythms[2]=[["2"],["4","4"],["4","8","8"],["8","8","4"],["d4","8"],["8","8","8","8"]]
*/

var MidiWriter = require('midi-writer-js');

var tracks = [];
tracks[0] = new MidiWriter.Track();
tracks[0].setTempo(200);
tracks[0].addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));

var notes=["A3","C#4","E4","A4","C#5","E5"];
var notes2=["A3","D4","F#4","A4","D5","F#5"];
var notes3=["B3","E4","G#4","B4","E5","G#5"];
var notes4=["C4","E4","G4","C5","E5","G5"];

var bnotes=["A2","C#3","E3","A3","C#4","E4"];
var bnotes2=["A2","D3","F#3","A3","D4","F#4"];
var bnotes3=["B2","E3","G#3","B3","E4","G#4"];
var bnotes4=["C3","E3","G3","C4","E4","G4"];

var rythms=[
	["2"],
	["4","4"],
	["4","8","8"],
	["8","8","4"],
	["d4","8"],
	["8","8","8","8"],
];
var last=3;	//index of last note played (to refer to distance)
for (var i=1; i<=16; i++) {
	var rythm=rythms[Math.floor(Math.random()*rythms.length)];
	for (var j=0; j<rythm.length; j++) {
		var noteIndex, choices=[last-2,last-1,last+1,last+2];
		while (1) {
			noteIndex=choices[Math.floor(Math.random()*choices.length)];
			if (noteIndex>=0&&noteIndex<notes.length) break;
		}
		last=noteIndex;
		tracks[0].addEvent(new MidiWriter.NoteEvent({pitch: [notes[noteIndex]], duration: rythm[j]}));
	}
}

var write = new MidiWriter.Writer(tracks);
write.saveMIDI("./projects/fugue-generator/stepping-test");