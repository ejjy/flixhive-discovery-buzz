
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Film, Heart, User, Home, TrendingUp, Info, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-flixhive-dark/95 backdrop-blur-sm sticky top-0 z-50 py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-white"
          onClick={() => setIsOpen(false)}
        >
          <Film className="h-6 w-6 text-flixhive-accent" />
          <span className="font-bold text-xl">FlixHive</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <SignedIn>
            <Link to="/dashboard" className="text-white hover:text-flixhive-accent transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-white hover:text-flixhive-accent transition-colors">
              Movies
            </Link>
            <Link to="/trending" className="text-white hover:text-flixhive-accent transition-colors">
              Trending
            </Link>
            <Link to="/watchlist" className="text-white hover:text-flixhive-accent transition-colors">
              Watchlist
            </Link>
            <Link to="/reviews" className="text-white hover:text-flixhive-accent transition-colors">
              Reviews
            </Link>
            <Link to="/about" className="text-white hover:text-flixhive-accent transition-colors">
              About
            </Link>
          </SignedIn>
          <SignedOut>
            <Link to="/" className="text-white hover:text-flixhive-accent transition-colors">
              Home
            </Link>
            <Link to="/trending" className="text-white hover:text-flixhive-accent transition-colors">
              Trending
            </Link>
            <Link to="/search" className="text-white hover:text-flixhive-accent transition-colors">
              Search
            </Link>
            <Link to="/about" className="text-white hover:text-flixhive-accent transition-colors">
              About
            </Link>
          </SignedOut>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search movies..."
              className="w-64 bg-flixhive-gray/50 border-flixhive-gray focus:border-flixhive-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full text-muted-foreground hover:text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9"
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <Button className="bg-flixhive-accent hover:bg-flixhive-accent/90">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <Button size="sm" className="bg-flixhive-accent hover:bg-flixhive-accent/90">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <Button
            variant="ghost" 
            size="icon"
            className="text-white"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-flixhive-dark border-b border-flixhive-gray p-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full bg-flixhive-gray/50 border-flixhive-gray"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full text-muted-foreground hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="space-y-4">
              <SignedIn>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/movies" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Film className="h-5 w-5" />
                  <span>Movies</span>
                </Link>
                <Link 
                  to="/trending" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending</span>
                </Link>
                <Link 
                  to="/watchlist" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Watchlist</span>
                </Link>
                <Link 
                  to="/reviews" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Reviews</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/trending" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending</span>
                </Link>
                <Link 
                  to="/search" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
