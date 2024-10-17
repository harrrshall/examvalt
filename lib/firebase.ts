// lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyB_HkcVDKFelsFBahldCljkjw3q-dWrGPE",
    authDomain: "examvalt.firebaseapp.com",
    projectId: "examvalt",
    storageBucket: "examvalt.appspot.com",
    messagingSenderId: "420041914286",
    appId: "1:420041914286:web:dcdd5fa0bd7e5dfcddfa3f",
    measurementId: "G-ZS0G97FFF7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
