import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore();
export { auth };
