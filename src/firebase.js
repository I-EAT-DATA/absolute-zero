import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

firebase.initializeApp({
  apiKey: "AIzaSyBgHVA0ag2UQtRo3cj8zArQH0WYL5egW9s",
  authDomain: "buzzer-dc25d.firebaseapp.com",
  projectId: "buzzer-dc25d",
  storageBucket: "buzzer-dc25d.appspot.com",
  messagingSenderId: "585787367676",
  appId: "1:585787367676:web:43c33c1b0ee4c235f67779",
  measurementId: "G-STWS7QDQKF"
});

// const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

export default firebase;