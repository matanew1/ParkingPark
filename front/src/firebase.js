import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5TzWJaa51x1h9WN82l5G8S20i5R6-oLo",
  authDomain: "parkingpark-15837.firebaseapp.com",
  projectId: "parkingpark-15837",
  storageBucket: "parkingpark-15837.appspot.com",
  messagingSenderId: "248662063028",
  appId: "1:248662063028:web:bb06176c7d9bdfef16e4e1",
  measurementId: "G-HEJNGBTP4G"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth, firebase }; 
