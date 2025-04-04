
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, createTestUser } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully", userCredential);
      toast({
        title: "Account created",
        description: "You have successfully created an account and logged in.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorCode = error.code || "unknown";
      const errorMessage = error.message || "Failed to create account";
      
      let friendlyMessage = "Failed to create account. Please try again.";
      if (errorCode === "auth/email-already-in-use") {
        friendlyMessage = "This email is already in use. Try signing in.";
      } else if (errorCode === "auth/weak-password") {
        friendlyMessage = "Please use a stronger password.";
      } else if (errorCode === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      } else if (errorCode.includes("api-key")) {
        friendlyMessage = "Authentication service issue. Please try again later.";
        console.error("Firebase API key issue:", errorCode, errorMessage);
      }
      
      toast({
        title: "Sign up failed",
        description: friendlyMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully", userCredential);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorCode = error.code || "unknown";
      
      let friendlyMessage = "Could not sign in. Please check your credentials.";
      if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        friendlyMessage = "Incorrect email or password.";
      } else if (errorCode === "auth/too-many-requests") {
        friendlyMessage = "Too many failed attempts. Please try again later.";
      } else if (errorCode.includes("api-key")) {
        friendlyMessage = "Authentication service issue. Please try again later.";
        console.error("Firebase API key issue:", errorCode, error.message);
      }
      
      toast({
        title: "Sign in failed",
        description: friendlyMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google successfully", result);
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      let friendlyMessage = "Could not sign in with Google. Please try again.";
      if (error.code && error.code.includes("api-key")) {
        friendlyMessage = "Authentication service issue. Please try again later.";
        console.error("Firebase API key issue:", error.code, error.message);
      }
      
      toast({
        title: "Google sign in failed",
        description: friendlyMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Sign out failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  useEffect(() => {
    // Create a test user when the app starts
    const setupTestUser = async () => {
      try {
        await createTestUser();
      } catch (error) {
        console.error("Failed to create test user:", error);
        // Don't throw error, just log it
      }
    };
    
    setupTestUser();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      if (user) {
        console.log("User auth state changed:", user.email);
      } else {
        console.log("No user is signed in");
      }
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    isSignedIn: !!currentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
