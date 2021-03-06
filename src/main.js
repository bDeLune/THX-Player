// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'


Vue.use(VueFire)
firebase.initializeApp({
  apiKey: "AIzaSyDoajjsGO2UBqlBJrR_Hamkmh5FHhXeVFk",
  authDomain: "thx-player.firebaseapp.com",
  databaseURL: "https://thx-player.firebaseio.com",
  projectId: "thx-player",
  storageBucket: "thx-player.appspot.com",
  messagingSenderId: "111990500140"
})
export const db = firebase.firestore()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
