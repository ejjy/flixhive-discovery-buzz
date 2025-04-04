
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
// Using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// For debugging
console.log("Firebase initialization with config:", { 
  apiKey: firebaseConfig.apiKey ? "Key provided" : "Key missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
let app;
let auth;
let db;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log("Firebase auth initialized:", auth ? "Success" : "Failed");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase. Check your configuration.");
}

// Export Firebase services
export { auth, db, googleProvider };

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
