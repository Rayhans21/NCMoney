// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA44izAiM1ghn11_zf77M1zHSh0jZo49Eo',
  authDomain: 'ncmoney-f340b.firebaseapp.com',
  projectId: 'ncmoney-f340b',
  storageBucket: 'ncmoney-f340b.firebasestorage.app',
  messagingSenderId: '238254226420',
  appId: '1:238254226420:web:14643c64ba96608b4417a1',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };
