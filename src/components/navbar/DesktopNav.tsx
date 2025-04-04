
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DesktopNav = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-6">
      {isSignedIn ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default DesktopNav;
