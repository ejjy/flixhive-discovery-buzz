
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
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Auto sign-in after sign-up is handled by onAuthStateChanged
        console.log("User signed up successfully");
        toast({
          title: "Account created",
          description: "You have successfully created an account and logged in.",
        });
      });
  };
  
  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Auto sign-in after sign-in is handled by onAuthStateChanged
        console.log("User signed in successfully");
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      });
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        // Auto sign-in after Google sign-in is handled by onAuthStateChanged
        console.log("User signed in with Google successfully");
        toast({
          title: "Welcome!",
          description: "You have successfully signed in with Google.",
        });
      });
  };
  
  const logout = async () => {
    return signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      });
  };
  
  useEffect(() => {
    // Create a test user when the app starts
    const setupTestUser = async () => {
      try {
        await createTestUser();
      } catch (error) {
        console.error("Failed to create test user:", error);
      }
    };
    
    setupTestUser();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
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
