<template>
  <div class="hello">
    <h2><button v-on:click="play()">PRESS TO PLAY</button></h2>
  <div>Make sure your volume is turned down before pressing this</div>
  </div>
</template>

<script>
let oscCount = 30
let oscArray = []
let oscVolArray = []
let lfo1Array = []
let lfo1GainArray = []
let lfo2Array = []
let lfo2GainArray = []
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
oscVolArray[0].gain.value = .05;
oscArray[0]= audioCtx.destination;  

//CREATE OSCILLATORS AND GAIN NODES
for (var i = 1; i <= oscCount; i++){
  oscVolArray[i] = audioCtx.createGain();

  if (i > 20){oscVolArray[i].gain.value = .02}else{oscVolArray[i].gain.value = .02}
  oscArray[i] = audioCtx.createOscillator();
              
  lfo1Array[i] = audioCtx.createOscillator();
  lfo1Array[i].frequency.value = .5 - i/10;
  lfo1GainArray[i] = audioCtx.createGain();
  lfo1GainArray[i].gain.value = 1 + i;
 
  lfo2Array[i] = audioCtx.createOscillator();
  lfo2Array[i].frequency.value = 0//.2 - i/10;
  lfo2GainArray[i] = audioCtx.createGain();
  lfo2GainArray[i].gain.value = 0//1 + i;
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
        for (var currOsc = 1; currOsc <= oscCount; currOsc++){
          oscArray[currOsc].frequency.value = Math.floor(Math.random() * (400 - 200 + 1)) + 200;;
          oscArray[currOsc].type = "sine"; console.log(oscArray[currOsc]);
          oscVolArray[currOsc].gain.value = 1; console.log(oscVolArray[currOsc]);
        }  
    },

//CONNECT ALL RELEVANT NODES AND BEGIN PLAYBACK
    play: function (event) {
      if (audioCtx){
        //this.stopAudio(0)//todo add playingison
        beginTime = audioCtx.currentTime
        console.log('Beginning at time: ' + beginTime)

        for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].start(0);  
          oscArray[currOsc].stop(23);  

          lfo1Array[currOsc].start(0);     //START LFO 1 
          lfo1Array[currOsc].stop(7);      //STOP LFO 1
          lfo1Array[currOsc].connect(lfo1GainArray[currOsc])
          lfo1GainArray[currOsc].connect(oscArray[currOsc].frequency)

          if (currOsc >= 20 && currOsc <= 30){
            lfo2Array[currOsc].start(0);   //START LFO 2 
            lfo2Array[currOsc].connect(lfo2GainArray[currOsc])

            lfo2Array[currOsc].frequency.linearRampToValueAtTime(.1, 19);
            lfo2GainArray[currOsc].connect(oscArray[currOsc].detune)
            //oscVolArray[currOsc].gain.linearRampToValueAtTime(.08, 16);
          }    

          oscArray[currOsc].connect(oscVolArray[currOsc]);
          oscVolArray[currOsc].connect(oscVolArray[0]);
          oscVolArray[0].connect(oscArray[0]);
        }    
        
        this.initArrangement()

      }else{
        console.log('audio context doesnt exist')
      }
    }, 

//SET ALL EVENTS TO OCCUR AT TIME
    initArrangement: function (){
      console.log('Initialising arrangement')
      //swarmLFO((beginTime +5), (beginTime + 10))
      this.convergeToFinalPosition((beginTime +5), (beginTime + 10))
      //finalLFO((beginTime +15), (beginTime + 20))
      //this.stopAudio(beginTime + 20)
    },

//BEGINNING SECTION LFO FOR EACH OSC
    swarmLFO: function (time,length){

    }, 

//CONVERGE EACH OSC TO CRESCENDO
    convergeToFinalPosition: function(startAt, length){
      var endAt = startAt + length;
      console.log('Converging to final position at ' + startAt + 'until ' + endAt)
     // while (audioCtx.currentTime > time && audioCtx.currentTime < endAt){
          for (var currOsc = 1; currOsc < oscCount; currOsc++){
            var currHZ = oscArray[currOsc].frequency.value

            if (currOsc > 0 && currOsc <= 2){
              var bandAFinalPitch = 36.71  //D1
              this.convergeToFreqAtTime(currOsc ,currHZ, bandAFinalPitch, startAt, endAt)
            }else if (currOsc > 2 && currOsc <= 4 ){
              var bandBFinalPitch = 73.42  //D2
              this.convergeToFreqAtTime(currOsc ,currHZ, bandBFinalPitch, startAt, endAt)
            }else if (currOsc > 4 && currOsc <= 6 ){
              var bandCFinalPitch = 110  //A2
              this.convergeToFreqAtTime(currOsc ,currHZ, bandCFinalPitch, startAt, endAt)
            }else if (currOsc > 6 && currOsc <= 10 ){
              var bandDFinalPitch = 146.83  //D3
              this.convergeToFreqAtTime(currOsc ,currHZ, bandDFinalPitch, startAt, endAt)
            }else if (currOsc > 10 && currOsc <= 12 ){
              var bandEFinalPitch = 220     //A3
              this.convergeToFreqAtTime(currOsc ,currHZ, bandEFinalPitch, startAt, endAt)
            }else if (currOsc > 12 && currOsc <= 15 ){
              var bandFFinalPitch = 293.66  //D4
              this.convergeToFreqAtTime(currOsc ,currHZ, bandFFinalPitch, startAt, endAt)
            }else if (currOsc > 15 && currOsc <= 18 ){
              var bandGFinalPitch = 440     //A4
              this.convergeToFreqAtTime(currOsc ,currHZ, bandGFinalPitch, startAt, endAt)
            }else if (currOsc > 18 && currOsc <= 21 ){
              var bandHFinalPitch = 587.33  //D5
              this.convergeToFreqAtTime(currOsc ,currHZ, bandHFinalPitch, startAt, endAt)
            }else if (currOsc > 21 && currOsc <= 24 ){
              var bandIFinalPitch = 880     //A6
              this.convergeToFreqAtTime(currOsc ,currHZ, bandIFinalPitch, startAt, endAt)
            }else if (currOsc > 24 && currOsc <= 27 ){
              var bandJFinalPitch = 1174.66  //D6
              this.convergeToFreqAtTime(currOsc ,currHZ, bandJFinalPitch, startAt, endAt)
            }else if (currOsc > 27 && currOsc <= 30 ){
              var bandKFinalPitch = 1479.98    //F#6
              this.convergeToFreqAtTime(currOsc ,currHZ, bandKFinalPitch, startAt, endAt)
            }
          }  
    //  }
    },

//ALTER EACH OSCILLATORS FREQ OVER TIME
    convergeToFreqAtTime: function (oscNo, origHZ, finalHZ, startAt, endAt){  
      console.log('converging osc ' + oscNo + ' from ' + origHZ + 'hz to' + finalHZ + 'hz/ ' + startAt + '--> ' + endAt)
      oscArray[oscNo].frequency.setValueAtTime(origHZ, startAt);
      oscArray[oscNo].frequency.linearRampToValueAtTime(finalHZ, endAt);
    },

//FINISH ARRANGEMENT AND STOP ALL
    stopAudio:function (endTime){
      console.log('stopping audio at ' + endTime)
      for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].stop(beginTime + 23);
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
a{
  color: #42b983;
} 

button {
  color: #42b983;
}
</style>
