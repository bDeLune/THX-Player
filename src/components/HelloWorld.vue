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

//AUDIOCONTEXT
if(window.AudioContext) {
  audioCtx = new AudioContext()
} else {
  audioCtx = new webkitAudioContext()
}

//CREATE OSCILLATORS AND GAIN NODES
for (var i = 1; i <= oscCount; i++){
  oscVolArray[i] = audioCtx.createGain();
  oscArray[i] = audioCtx.createOscillator();
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

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted:function(){
    this.setInitParams() 
  },
  methods: {
    setInitParams: function (){
      console.log('Setting up')

      //SET VOLUME AND FREQUENCY TO STARTING POINT
      oscArray.forEach(function(osc) {
        osc.frequency.value = Math.floor(Math.random() * (400 - 200 + 1)) + 200;;
        osc.type = "sine";
        console.log(osc);
      });

      oscVolArray.forEach(function(oscGain) {
        oscGain.gain.value = 0;
        console.log(oscGain);
      });
    },
    play: function (event) {
      if (audioCtx){

        this.stopAudio(0)
        beginTime = audioCtx.currentTime
        console.log('Beginning at time: ' + beginTime)

        //CONNECT ALL NECESSSARY NODES
        for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].start(0);
          oscArray[currOsc].connect(oscVolArray[currOsc]);

          //LINK OUR LFO'S
          //oscVolArray[currOsc].connect(lfoArray[0])
          //oscVolArray[currOsc].connect(lfoArray[1])

          oscVolArray[currOsc].connect(oscVolArray[0]);
          oscVolArray[0].connect(oscArray[0]);

          console.log('playing osc: ' + currOsc)
        }    

        this.followScore()

      }else{
        console.log('audio context doesnt exist')
      }
    }, 

    followScore: function (){
      console.log('Creating arrangement')
      //swarmLFO((beginTime +5), (beginTime + 10))
      //convergeToFinalPosition(beginTime +10), (beginTime + 15))
      //finalLFO((beginTime +15), (beginTime + 20))
      stopAudio((beginTime + 20))
    },
    
    swarmLFO: function (time,length){

      swarmLFO.type = 'sine';
      swarmLFO.start();
      swarmLFO.connect(swarmLFOGain);
      swarmLFO.frequency.value = 5;
      swarmLFOGain.gain.value = 10000;

      for (var currOsc = 1; currOsc < oscCount; currOsc++){
          swarmLFOGain.connect(oscArray[currOsc].frequency.detune);
          console.log('detuning osc: ' + currOsc)
        } 
      
    }, 
    convergeToFinalPosition: function(time, length){
      var endAt = time + length;
      console.log('Converging to final position at ' + time + 'until ' + endAt)
      while (audioCtx.currentTime > time && audioCtx.currentTime < endAt){
          //
          for (var currOsc = 1; currOsc < oscCount; currOsc++){
            var currFreq = oscArray[currOsc].frequency.value

            if (currOsc < 4){


            }else if (currOsc > 4 && currOsc < 9 ){



            }else if (currOsc > 4 && currOsc < 9 ){



            }



          }  
      }
    },

    stopAudio:function (time){
      console.log('stopping audio at ' + time)
      for (var currOsc = 1; currOsc < oscCount; currOsc++){
          oscArray[currOsc].stop(time);
          console.log('stopped osc: ' + currOsc + 'at ' + time)
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
