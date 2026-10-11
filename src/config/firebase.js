import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Firebase configuration (from .env)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq4WdbIKdfRrNgxn3vfsBBzQR8rCXPPow",
  authDomain: "busybuy-app-efd01.firebaseapp.com",
  projectId: "busybuy-app-efd01",
  storageBucket: "busybuy-app-efd01.firebasestorage.app",
  messagingSenderId: "280244279776",
  appId: "1:280244279776:web:8e566896706986dd81f385"
};


// Debug (optional)
// console.log(process.env);
// console.log(process.env.REACT_APP_FIREBASE_API_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);

// Keep user logged in after refresh
setPersistence(auth, browserLocalPersistence);
