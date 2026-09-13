// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4CGRJVtd5BmrMmCHT0eEM05gLlhnNn8Q",
  authDomain: "cashpilot-dab43.firebaseapp.com",
  projectId: "cashpilot-dab43",
  storageBucket: "cashpilot-dab43.firebasestorage.app",
  messagingSenderId: "85099907729",
  appId: "1:85099907729:web:36ecc389118a0a5a958d30",
  measurementId: "G-NLPPEV8HPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
