
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define a simplified User type
interface SimpleUser {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  currentUser: SimpleUser | null;
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

// Simple localStorage keys for mock auth
const AUTH_USER_KEY = "flixhive-auth-user";
const TEST_USER_EMAIL = "test@flixhive.com";
const TEST_USER_PASSWORD = "password123";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Check for existing user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);
  
  const signUp = async (email: string, password: string) => {
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Check if user already exists
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          throw new Error("Email already in use");
        }
      }
      
      // Create mock user
      const newUser: SimpleUser = {
        uid: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        displayName: email.split("@")[0],
      };
      
      setCurrentUser(newUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: "You have successfully created an account and logged in.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      // For the test user, allow login without checking localStorage
      if (email === TEST_USER_EMAIL && password === TEST_USER_PASSWORD) {
        const testUser: SimpleUser = {
          uid: "test-user-id",
          email: TEST_USER_EMAIL,
          displayName: "Test User",
        };
        
        setCurrentUser(testUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(testUser));
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in as the test user.",
        });
        return;
      }
      
      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Mock auth check - in a real app, this would validate credentials against a backend
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (!storedUser) {
        throw new Error("User not found");
      }
      
      const user = JSON.parse(storedUser);
      if (user.email !== email) {
        throw new Error("Invalid credentials");
      }
      
      // In a real app, we'd validate the password against a hash
      // Here, we just assume it's correct if the email matches
      
      setCurrentUser(user);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      toast({
        title: "Sign in failed",
        description: error.message || "Could not sign in. Please check your credentials.",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      // Create a mock Google user
      const googleUser: SimpleUser = {
        uid: `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        displayName: "Google User",
        photoURL: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      };
      
      setCurrentUser(googleUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
      
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      toast({
        title: "Google sign in failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem(AUTH_USER_KEY);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      toast({
        title: "Sign out failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };
  
  const createTestUser = async () => {
    try {
      const testUser: SimpleUser = {
        uid: "test-user-id",
        email: TEST_USER_EMAIL,
        displayName: "Test User",
      };
      
      setCurrentUser(testUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(testUser));
      
      toast({
        title: "Test user created",
        description: "You have been signed in as the test user.",
      });
      
      return testUser;
    } catch (error: any) {
      console.error("Error creating test user:", error);
      toast({
        title: "Error",
        description: "Could not create test user",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Set up test user on first load
  useEffect(() => {
    if (!isLoading && !currentUser) {
      // Don't automatically log in the test user
      console.log("Test user is available with email: test@flixhive.com and password: password123");
    }
  }, [isLoading, currentUser]);
  
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
