// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-7860a.firebaseapp.com",
  projectId: "real-estate-7860a",
  storageBucket: "real-estate-7860a.appspot.com",
  messagingSenderId: "728405743675",
  appId: "1:728405743675:web:2f2ed167f99290bf04e41e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);