
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Film, Tv, Star, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Landing = () => {
  const { isSignedIn, signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Could not sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signUp(email, password);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-800 to-indigo-900 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        {/* Background film elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -rotate-12 left-1/4 top-1/4">
            <Film className="h-32 w-32 text-amber-300" />
          </div>
          <div className="absolute rotate-12 right-1/4 top-1/3">
            <Clapperboard className="h-40 w-40 text-amber-300" />
          </div>
          <div className="absolute -rotate-6 left-1/3 bottom-1/4">
            <Star className="h-20 w-20 text-amber-300" />
          </div>
          <div className="absolute rotate-12 right-1/3 bottom-1/3">
            <Tv className="h-24 w-24 text-amber-300" />
          </div>
          <div className="absolute -rotate-12 left-2/3 top-1/2">
            <Film className="h-36 w-36 text-amber-300" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          <div className="flex flex-col justify-center">
            <div className="mb-8 flex items-center justify-center md:justify-start relative z-10">
              <Film className="h-12 w-12 text-amber-400 mr-2" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Flix<span className="text-amber-400">Hive</span>
              </h1>
            </div>
            
            <h2 className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl relative z-10 text-center md:text-left">
              Find out what to watch, with the best reviews and ratings
            </h2>
            
            <p className="text-white/80 mb-12 max-w-xl relative z-10 text-center md:text-left">
              Discover new movies, get personalized recommendations, and join a community of movie enthusiasts.
            </p>
          </div>
          
          <div className="flex items-center justify-center relative z-10">
            <Card className="w-full max-w-sm bg-flixhive-dark/80 backdrop-blur-sm border-flixhive-gray/30">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-3 py-2">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Sign In</CardTitle>
                      <CardDescription className="text-white/70 text-sm">
                        Enter your credentials
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com"
                          className="bg-flixhive-gray/50 border-flixhive-gray/30 text-white h-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-white/80 text-sm">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          className="bg-flixhive-gray/50 border-flixhive-gray/30 text-white h-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 p-4 pt-0">
                      <Button 
                        type="submit" 
                        className="w-full bg-flixhive-accent hover:bg-flixhive-accent/90 text-white h-9"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-flixhive-dark px-2 text-white/60">or</span>
                        </div>
                      </div>
                      <Button 
                        type="button"
                        className="w-full bg-white text-gray-800 hover:bg-white/90 h-9"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-3 py-2">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Sign Up</CardTitle>
                      <CardDescription className="text-white/70 text-sm">
                        Create an account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                      <div className="space-y-1">
                        <Label htmlFor="new-email" className="text-white/80 text-sm">Email</Label>
                        <Input 
                          id="new-email" 
                          type="email" 
                          placeholder="your@email.com"
                          className="bg-flixhive-gray/50 border-flixhive-gray/30 text-white h-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-password" className="text-white/80 text-sm">Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          className="bg-flixhive-gray/50 border-flixhive-gray/30 text-white h-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-white/60">Password must be at least 6 characters</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 p-4 pt-0">
                      <Button 
                        type="submit" 
                        className="w-full bg-flixhive-accent hover:bg-flixhive-accent/90 text-white h-9"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Account"}
                      </Button>
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-flixhive-dark px-2 text-white/60">or</span>
                        </div>
                      </div>
                      <Button 
                        type="button"
                        className="w-full bg-white text-gray-800 hover:bg-white/90 h-9"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 px-4 bg-indigo-950/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-sky-900/60 border border-sky-700/30 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-amber-300 mb-3">AI-Powered Reviews</h3>
              <p className="text-white/90">Get insightful movie reviews generated by our AI from trusted sources.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-sky-900/60 border border-sky-700/30 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-amber-300 mb-3">Personalized Recommendations</h3>
              <p className="text-white/90">Discover movies tailored to your preferences and viewing history.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-sky-900/60 border border-sky-700/30 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-amber-300 mb-3">Track Your Watchlist</h3>
              <p className="text-white/90">Save movies to watch later and keep track of what you've seen.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 bg-indigo-950 text-center text-white/60">
        <p>© 2025 <a href="https://www.flixhive.in" className="hover:text-amber-400 transition-colors">www.flixhive.in</a> - PineGrass Tech</p>
      </footer>
    </div>
  );
};

export default Landing;
