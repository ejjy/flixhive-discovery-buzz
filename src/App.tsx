
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import Movies from "./pages/Movies";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Trending from "./pages/Trending";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// Your Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

const queryClient = new QueryClient();

// ProtectedRoute component to handle auth checks
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

// AdminRoute component to handle admin checks (simplified for demo)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      {/* Add actual admin role check here in a real application */}
      {children}
    </ProtectedRoute>
  );
};

// Custom appearance for Clerk
const clerkAppearance = {
  baseTheme: dark,
  elements: {
    formButtonPrimary: "bg-flixhive-accent hover:bg-flixhive-accent/90 text-white",
    card: "bg-flixhive-dark border border-flixhive-gray/30",
    headerTitle: "text-white",
    headerSubtitle: "text-white/70",
    socialButtonsIconButton: "bg-flixhive-gray/50 border border-flixhive-gray/30 hover:bg-flixhive-gray",
    formFieldInput: "bg-flixhive-gray/50 border-flixhive-gray/30 text-white",
    formFieldLabel: "text-white/80",
    footerActionLink: "text-flixhive-accent hover:text-flixhive-accent/90",
    identityPreviewEditButton: "text-flixhive-accent",
    userButtonPopoverCard: "bg-flixhive-dark border border-flixhive-gray/30",
    userButtonPopoverActionButton: "hover:bg-flixhive-gray/50",
    userButtonPopoverActionButtonIcon: "text-white/70",
    userButtonPopoverActionButtonText: "text-white"
  }
};

const App = () => (
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY} 
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    appearance={clerkAppearance}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    signInFallbackRedirectUrl="/dashboard"
    signUpFallbackRedirectUrl="/dashboard"
    afterSignOutUrl="/"
    localization={{
      signIn: {
        start: {
          title: "Sign in to FlixHive",
          subtitle: "to continue to FlixHive"
        },
        emailCode: {
          title: "Check your email",
          subtitle: "to continue to FlixHive"
        }
      },
      signUp: {
        start: {
          title: "Create your account",
          subtitle: "to get started with FlixHive"
        },
        emailLink: {
          title: "Verify your email",
          subtitle: "to continue to FlixHive"
        }
      }
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WatchlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes (No Login Required) */}
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/about" element={<About />} />

              {/* User pages (Requires Login) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              <Route path="/reviews" element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/movies" element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              } />
              
              {/* Admin pages */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } />
              
              {/* 404 for non-matched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WatchlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
