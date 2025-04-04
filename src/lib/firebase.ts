
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
// Using hardcoded config instead of env variables to prevent issues
const firebaseConfig = {
  apiKey: "AIzaSyDO_6CKlSXCYRD3-gK6zEgPhWBrJrgASVo",
  authDomain: "flix-hive-demo.firebaseapp.com",
  projectId: "flix-hive-demo",
  storageBucket: "flix-hive-demo.appspot.com",
  messagingSenderId: "132095111673",
  appId: "1:132095111673:web:eb374ce9379709281faf2e"
};

// For debugging
console.log("Firebase initialization with config:", { 
  apiKey: firebaseConfig.apiKey ? "Key provided" : "Key missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Initialize Firebase services
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const googleProvider = new GoogleAuthProvider();
  
  console.log("Firebase auth initialized:", auth ? "Success" : "Failed");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase. Check your configuration.");
}

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
