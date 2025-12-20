// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-RSHS78ibF79Uj9YWfgFsuQIGDICcN2w",
  authDomain: "scci-quiz-2026.firebaseapp.com",
  databaseURL: "https://scci-quiz-2026-default-rtdb.firebaseio.com",
  projectId: "scci-quiz-2026",
  storageBucket: "scci-quiz-2026.firebasestorage.app",
  messagingSenderId: "715365309700",
  appId: "1:715365309700:web:50e4293d0de0cf0952c451",
  measurementId: "G-3E9NX5DZDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
