// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFhluEfxV__kef0CTU-r8BKWJPc3r8sp8",
  authDomain: "rapiddisco-62601.firebaseapp.com",
  projectId: "rapiddisco-62601",
  storageBucket: "rapiddisco-62601.appspot.com",
  messagingSenderId: "770623156898",
  appId: "1:770623156898:web:10ef72988e2bdb97d05dfb",
  measurementId: "G-N8HK64SP8F"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}