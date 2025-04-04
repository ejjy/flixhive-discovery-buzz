
import { initializeApp } from "firebase/app";
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
let db;

try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Initialize Firebase services
  db = getFirestore(app);
  
  console.log("Firebase services initialized");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase. Check your configuration.");
}

// Export Firebase services
export { db };

// Helper to check if a user is an admin (simplified mock)
export const isUserAdmin = (user: any) => {
  // For demo purposes, consider test@flixhive.com as admin
  return user?.email === "test@flixhive.com";
};

export default app;
