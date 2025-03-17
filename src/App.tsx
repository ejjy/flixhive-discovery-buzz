
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

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} clerkJSVersion="5.56.0-snapshot.v20250312225817">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WatchlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              
              {/* Protected routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/movie/:id" element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              } />
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              <Route path="/movies" element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } />
              
              {/* Default redirect to landing for non-authenticated and 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WatchlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
