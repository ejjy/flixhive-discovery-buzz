
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

// ProtectedRoute component to handle auth checks
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  
  return isSignedIn ? <>{children}</> : <Navigate to="/" replace />;
};

// AdminRoute component to handle admin checks (simplified for demo)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // For demo purposes, we'll just use ProtectedRoute
  // In a real app, you'd check for admin role
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
