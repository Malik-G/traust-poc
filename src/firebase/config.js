import firebase from 'firebase/app';
import 'firebase/storage';
import api_key from './api_key';

// Initialize Firebase
var config = {
   apiKey: api_key,
   authDomain: "traust-poc.firebaseapp.com",
   databaseURL: "https://traust-poc.firebaseio.com",
   projectId: "traust-poc",
   storageBucket: "traust-poc.appspot.com",
   messagingSenderId: "159349695299"
 };
 
 firebase.initializeApp(config);
 const storage = firebase.storage();
 export {
    storage, firebase as default
 }