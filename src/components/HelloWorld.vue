<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2><button v-on:click="play()">PRESS TO PLAY</button></h2>
  <div>Make sure your volume is turned down before pressing this</div>
  </div>
</template>

<script>
let oscCount = 30
let oscArray = []
let oscVolArray = []
let lfoArray = []
let lfoGainArray = []
let audioCtx
let bpm = 60
var beginTime
//1 bar is 4 seconds
//2 bars swarm
//2 bars converge
//2 bars hold

//CREATE AUDIOCONTEXT
if(window.AudioContext) {
  audioCtx = new AudioContext()
} else {
  audioCtx = new webkitAudioContext()
}
//ADD MASTER NODE
oscVolArray[0] = audioCtx.createGain();
oscArray[0]= audioCtx.destination;  
//SWARM LFO
lfoArray[0]= audioCtx.createOscillator();
lfoGainArray[0] = audioCtx.createGain();
//FINAL LFO
lfoArray[1]= audioCtx.createOscillator();
lfoGainArray[1] = audioCtx.createGain();
//CREATE OSCILLATORS AND GAIN NODES
for (var i = 1; i <= oscCount; i++){
  oscVolArray[i] = audioCtx.createGain();
  oscArray[i] = audioCtx.createOscillator();
}

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted: function(){
    this.setInitParams() 
  },
  methods: {
    
//RESET VOLUME AND FREQUENCY TO STARTING POINT
    setInitParams: function () {
      console.log('Setting up')
   
      oscArray.forEach(function(osc) {
        osc.frequency.value = Math.floor(Math.random() * (400 - 200 + 1)) + 200;;
        osc.type = "sine"; console.log(osc);
      });

      oscVolArray.forEach(function(oscGain) {
        oscGain.gain.value = 0; console.log(oscGain);
      });
    },

//CONNECT ALL RELEVANT NODES AND BEGIN PLAYBACK
    play: function (event) {
      if (audioCtx){
        //this.stopAudio(0)//todo add playingison
        beginTime = audioCtx.currentTime
        console.log('Beginning at time: ' + beginTime)

        for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].start(0);
          oscArray[currOsc].connect(oscVolArray[currOsc]);
          //oscVolArray[currOsc].connect(lfoArray[0])
          //oscVolArray[currOsc].connect(lfoArray[1])
          oscVolArray[currOsc].connect(oscVolArray[0]);
        }    

        oscVolArray[0].connect(oscArray[0]);
        this.initArrangement()

      }else{
        console.log('audio context doesnt exist')
      }
    }, 

//SET ALL EVENTS TO OCCUR AT TIME
    initArrangement: function (){
      console.log('Initialising arrangement')
      //swarmLFO((beginTime +5), (beginTime + 10))
      convergeToFinalPosition((beginTime +5), (beginTime + 10))
      //finalLFO((beginTime +15), (beginTime + 20))
      stopAudio(beginTime + 20)
    },

//BEGINNING SECTION LFO FOR EACH OSC
    swarmLFO: function (time,length){
      swarmLFO.type = 'sine';
      swarmLFO.start();
      swarmLFO.connect(swarmLFOGain);
      swarmLFO.frequency.value = 5;
      swarmLFOGain.gain.value = 10000;  
    }, 

//CONVERGE EACH OSC TO CRESCENDO
    convergeToFinalPosition: function(startAt, length){
      var endAt = time + length;
      console.log('Converging to final position at ' + time + 'until ' + endAt)
     // while (audioCtx.currentTime > time && audioCtx.currentTime < endAt){
          for (var currOsc = 1; currOsc < oscCount; currOsc++){
            var currHZ = oscArray[currOsc].frequency.value

            if (currOsc > 0 && currOsc <= 2){
              bandAFinalPitch = 38.891  //D#1
              convergeToFreqAtTime(currOsc ,currHZ, bandAFinalPitch, startAt, endAt)
            }else if (currOsc > 2 && currOsc <= 4 ){
              bandBFinalPitch = 77.782  //D#2
              convergeToFreqAtTime(currOsc ,currHZ, bandBFinalPitch, startAt, endAt)
            }else if (currOsc > 4 && currOsc <= 6 ){
              bandCFinalPitch = 116.54  //A2
              convergeToFreqAtTime(currOsc ,currHZ, bandCFinalPitch, startAt, endAt)
            }else if (currOsc > 6 && currOsc <= 10 ){
              bandDFinalPitch = 155.56  //D#3
              convergeToFreqAtTime(currOsc ,currHZ, bandDFinalPitch, startAt, endAt)
            }else if (currOsc > 10 && currOsc <= 12 ){
              bandEFinalPitch = 220     //A3
              convergeToFreqAtTime(currOsc ,currHZ, bandEFinalPitch, startAt, endAt)
            }else if (currOsc > 12 && currOsc <= 15 ){
              bandFFinalPitch = 311.13  //D#4
              convergeToFreqAtTime(currOsc ,currHZ, bandFFinalPitch, startAt, endAt)
            }else if (currOsc > 15 && currOsc <= 18 ){
              bandGFinalPitch = 440     //A4
              convergeToFreqAtTime(currOsc ,currHZ, bandGFinalPitch, startAt, endAt)
            }else if (currOsc > 18 && currOsc <= 21 ){
              bandHFinalPitch = 622.25  //D5
              convergeToFreqAtTime(currOsc ,currHZ, bandHFinalPitch, startAt, endAt)
            }else if (currOsc > 21 && currOsc <= 24 ){
              bandIFinalPitch = 880     //A6
              convergeToFreqAtTime(currOsc ,currHZ, bandIFinalPitch, startAt, endAt)
            }else if (currOsc > 24 && currOsc <= 27 ){
              bandJFinalPitch = 1244.5  //D6
              convergeToFreqAtTime(currOsc ,currHZ, bandJFinalPitch, startAt, endAt)
            }else if (currOsc > 27 && currOsc <= 30 ){
              bandKFinalPitch = 1480    //F#6
              convergeToFreqAtTime(currOsc ,currHZ, bandKFinalPitch, startAt, endAt)
            }
          }  
    //  }
    },

//ALTER EACH OSCILLATORS FREQ OVER TIME
    convergeToFreqAtTime: function (oscNo, origHZ, finalHZ, startAt, endAt){
      oscArray[oscNo].frequency.setValueAtTime(origHZ, startAt);
      oscArray[oscNo].frequency.linearRampToValueAtTime(finalHZ, endAt);
    },

//FINISH ARRANGEMENT AND STOP ALL
    stopAudio:function (endTime){
      console.log('stopping audio at ' + endTime)
      for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].stop(endTime);
          console.log('stopped osc: ' + currOsc + 'at ' + endTime)
      }  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a, button {
  color: #42b983;
}
</style>
