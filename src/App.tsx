
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
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
const CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_REPLACE_WITH_ACTUAL_KEY";

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
// In a real app, you would check if the user has admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      {/* Add actual admin role check here in a real application */}
      {children}
    </ProtectedRoute>
  );
};

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} clerkJSVersion="5.56.0-snapshot.v20250312225817">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WatchlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes (No Login Required) */}
              <Route path="/" element={<Landing />} />
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
