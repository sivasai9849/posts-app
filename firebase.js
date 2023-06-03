import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyBWccTvvvw2fospnVyHaqvMfyjanOcd_vY",
  authDomain: "myapp-5f0a8.firebaseapp.com",
  projectId: "myapp-5f0a8",
  storageBucket: "myapp-5f0a8.appspot.com",
  messagingSenderId: "678291547517",
  appId: "1:678291547517:web:edaa9724475ebe82565814",
  measurementId: "G-7QJK3ZJR6G"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
