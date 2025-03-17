
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Film, Heart, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
          <Link to="/" className="text-white hover:text-flixhive-accent transition-colors">
            Home
          </Link>
          <Link to="/movies" className="text-white hover:text-flixhive-accent transition-colors">
            Movies
          </Link>
          <Link to="/watchlist" className="text-white hover:text-flixhive-accent transition-colors">
            Watchlist
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center space-x-2">
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
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost" 
          size="icon"
          className="md:hidden text-white"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

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
              <Link 
                to="/" 
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
                to="/watchlist" 
                className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Watchlist</span>
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
