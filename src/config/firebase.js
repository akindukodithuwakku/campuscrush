import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials

const firebaseConfig = {
  apiKey: "AIzaSyDwJw1MSdCCcBpI9Lgxtpyx9kjqcaEluCs",
  authDomain: "campuscrush-b22.firebaseapp.com",
  projectId: "campuscrush-b22",
  storageBucket: "campuscrush-b22.firebasestorage.app",
  messagingSenderId: "480694292931",
  appId: "1:480694292931:web:83594ed1d4ef713197ad76",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


