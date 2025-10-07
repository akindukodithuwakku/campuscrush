import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
// Using environment variables for security

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured =
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (!isFirebaseConfigured) {
  console.warn(
    "🔥 Firebase not configured. Please set up your .env file with Firebase credentials."
  );
  console.warn("📝 See HYBRID_SYSTEM_SETUP.md for configuration instructions.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional) - only if properly configured
let analytics = null;
if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics initialization failed:", error.message);
  }
}
export { analytics };

// Connect to emulators in development (optional)
if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true"
) {
  // Uncomment these lines if you want to use Firebase emulators for local development
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}

export default app;
