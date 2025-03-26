// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAF70m4Jt9VM8N6PDzfywn2mAPN4xQU76U",
  authDomain: "mrayoor-40326.firebaseapp.com",
  projectId: "mrayoor-40326",
  storageBucket: "mrayoor-40326.appspot.com", // Corrected
  messagingSenderId: "38920437239",
  appId: "1:38920437239:web:8e9573928914421e7982f2",
  measurementId: "G-QG7FJ75PD8"
};

// Check if Firebase is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
