// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAEuAR8MDHhHx8YcLZSrwYIWsz-e2MbCk4",
    authDomain: "softwareapu.firebaseapp.com",
    projectId: "softwareapu",
    storageBucket: "softwareapu.firebasestorage.app",
    messagingSenderId: "243456271515",
    appId: "1:243456271515:web:3fdc1f9044a2bc27d5923e",
    measurementId: "G-MYFMEFFK44"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
