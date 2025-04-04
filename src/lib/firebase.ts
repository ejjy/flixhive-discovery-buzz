
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// For debugging
console.log("Firebase config:", { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "Key exists" : "Key missing",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
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
