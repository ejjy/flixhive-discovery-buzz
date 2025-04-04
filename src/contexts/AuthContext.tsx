
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
import { auth } from "@/lib/firebase";

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
  
  const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Auto sign-in after sign-up is handled by onAuthStateChanged
        console.log("User signed up successfully");
      });
  };
  
  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Auto sign-in after sign-in is handled by onAuthStateChanged
        console.log("User signed in successfully");
      });
  };
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        // Auto sign-in after Google sign-in is handled by onAuthStateChanged
        console.log("User signed in with Google successfully");
      });
  };
  
  const logout = async () => {
    return signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      });
  };
  
  useEffect(() => {
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
