import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

firebase.initializeApp({
  apiKey: "AIzaSyANUfJcJb6Ns-hBXhQKKlX-EAQdeLVjFZI",
  authDomain: "absolute-zero-577ea.firebaseapp.com",
  projectId: "absolute-zero-577ea",
  storageBucket: "absolute-zero-577ea.appspot.com",
  messagingSenderId: "788699801382",
  appId: "1:788699801382:web:b965ae18d5168c5cb683e7",
  measurementId: "G-74X73TEM5B"
});

// const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

export default firebase;