
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BadgePlus, LogIn, LogOut, Loader2, Info } from 'lucide-react';
import { useEnvVariables } from '@/hooks/useEnvVariables';

export default function TestAuthPanel() {
  const [email, setEmail] = useState('test@flixhive.com');
  const [password, setPassword] = useState('password123');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, signIn, signUp, logout, isSignedIn } = useAuth();
  const { getStatus, isFirebaseConfigComplete } = useEnvVariables();

  const handleTestUserCreation = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signIn('test@flixhive.com', 'password123');
      setEmail('test@flixhive.com');
      setPassword('password123');
    } catch (error: any) {
      console.error("Error creating test user:", error);
      setAuthError(error.message || 'Failed to create test user');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      setAuthError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signUp(email, password);
    } catch (error: any) {
      console.error("Sign up error:", error);
      setAuthError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      setAuthError(error.message || 'Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (isSignedIn) {
      return (
        <div className="flex flex-col gap-4">
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <p className="text-green-800 font-medium">Signed in as:</p>
            <p className="text-green-700">{currentUser?.email}</p>
            <p className="text-xs text-green-600 mt-1">User ID: {currentUser?.uid}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            Sign Out
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email address" 
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            onClick={handleSignIn}
            className="flex-1"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            variant="outline" 
            className="flex-1"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BadgePlus className="mr-2 h-4 w-4" />}
            Sign Up
          </Button>
        </div>

        <div className="mt-2">
          <Button 
            onClick={handleTestUserCreation}
            variant="secondary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Use Test User
          </Button>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Uses test@flixhive.com with password: password123
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          Sign in or create an account to access all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseConfigComplete() && (
          <Alert variant="default" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Configuration Notice</AlertTitle>
            <AlertDescription>
              Using simplified authentication without Firebase.
            </AlertDescription>
          </Alert>
        )}
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        {renderForm()}
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-gray-500">
        <p className="mb-2">
          Using localStorage-based authentication
        </p>
        <div className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32 w-full">
          <p className="font-semibold">Note:</p>
          <p>Firebase Auth has been removed. Using simplified auth with localStorage.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
