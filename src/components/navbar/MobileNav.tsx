
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Film, TrendingUp, Heart, MessageSquare, User, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  toggleMenu, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  const { currentUser, isSignedIn } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-3">
      {isSignedIn ? (
        <Avatar className="w-8 h-8">
          <AvatarImage 
            src={currentUser?.photoURL || ''} 
            alt="User avatar" 
          />
          <AvatarFallback>
            {currentUser?.displayName ? currentUser.displayName[0] : 
             currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Link to="/landing">
          <Button size="sm" className="bg-flixhive-accent hover:bg-flixhive-accent/90">
            Sign In
          </Button>
        </Link>
      )}
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
            {isSignedIn ? (
              <>
                <MobileNavLink to="/dashboard" icon={<Home className="h-5 w-5" />} label="Home" toggleMenu={toggleMenu} />
                <MobileNavLink to="/movies" icon={<Film className="h-5 w-5" />} label="Movies" toggleMenu={toggleMenu} />
                <MobileNavLink to="/trending" icon={<TrendingUp className="h-5 w-5" />} label="Trending" toggleMenu={toggleMenu} />
                <MobileNavLink to="/watchlist" icon={<Heart className="h-5 w-5" />} label="Watchlist" toggleMenu={toggleMenu} />
                <MobileNavLink to="/reviews" icon={<MessageSquare className="h-5 w-5" />} label="Reviews" toggleMenu={toggleMenu} />
                <MobileNavLink to="/profile" icon={<User className="h-5 w-5" />} label="Profile" toggleMenu={toggleMenu} />
                <MobileNavLink to="/about" icon={<Info className="h-5 w-5" />} label="About" toggleMenu={toggleMenu} />
              </>
            ) : (
              <>
                <MobileNavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" toggleMenu={toggleMenu} />
                <MobileNavLink to="/trending" icon={<TrendingUp className="h-5 w-5" />} label="Trending" toggleMenu={toggleMenu} />
                <MobileNavLink to="/search" icon={<Search className="h-5 w-5" />} label="Search" toggleMenu={toggleMenu} />
                <MobileNavLink to="/about" icon={<Info className="h-5 w-5" />} label="About" toggleMenu={toggleMenu} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  toggleMenu: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, toggleMenu }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center space-x-2 text-white hover:text-flixhive-accent transition-colors"
      onClick={toggleMenu}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default MobileNav;
