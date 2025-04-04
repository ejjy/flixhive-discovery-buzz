
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO_6CKlSXCYRD3-gK6zEgPhWBrJrgASVo",
  authDomain: "flix-hive-demo.firebaseapp.com",
  projectId: "flix-hive-demo",
  storageBucket: "flix-hive-demo.appspot.com",
  messagingSenderId: "132095111673",
  appId: "1:132095111673:web:eb374ce9379709281faf2e"
};

// For debugging
console.log("Firebase config details:", { 
  apiKey: firebaseConfig.apiKey ? "Key provided directly" : "Key missing",
  apiKeyFromEnv: import.meta.env.VITE_FIREBASE_API_KEY ? "Env key exists" : "Env key missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Create a test user for easy testing
export const createTestUser = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      "test@flixhive.com", 
      "password123"
    );
    console.log("Test user created:", userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    // If user already exists, just log the error but don't throw
    if (error.code === 'auth/email-already-in-use') {
      console.log("Test user already exists, you can sign in with these credentials");
      return null;
    }
    console.error("Error creating test user:", error);
    throw error;
  }
};

// Helper to check if a user is an admin (for demo purposes)
export const isUserAdmin = (user: User | null) => {
  // For demo purposes, let's consider the test user as an admin
  return user?.email === "test@flixhive.com";
};

export default app;
