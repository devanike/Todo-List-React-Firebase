// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBuUtVfyQdMI3WAC-W5uMQR5HfZbe3mv6M",
    authDomain: "todo-list-fb840.firebaseapp.com",
    projectId: "todo-list-fb840",
    storageBucket: "todo-list-fb840.firebasestorage.app",
    messagingSenderId: "1065932437916",
    appId: "1:1065932437916:web:e4abe0b0a39c2533f03059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };  // Export Firestore
