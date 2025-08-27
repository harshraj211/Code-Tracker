// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "codetracker-4ptpq",
  appId: "1:516351299776:web:b7612499e4594e65d4dd25",
  storageBucket: "codetracker-4ptpq.firebasestorage.app",
  apiKey: "AIzaSyBUyy6Qi9Q4JVwqQETomxGPM9GUIZe7dM4",
  authDomain: "codetracker-4ptpq.firebaseapp.com",
  messagingSenderId: "516351299776",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
