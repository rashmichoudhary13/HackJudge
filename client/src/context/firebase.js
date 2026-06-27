// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6jfzk9IR17YQ2AjJ8_mmK4b8UjHaxEGc",
  authDomain: "mock-interview-10b80.firebaseapp.com",
  projectId: "mock-interview-10b80",
  storageBucket: "mock-interview-10b80.firebasestorage.app",
  messagingSenderId: "24551177151",
  appId: "1:24551177151:web:65f5b2be883b68f8163f0a",
  measurementId: "G-MYMHCBFM40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);