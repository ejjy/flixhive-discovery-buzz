
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import SearchForm from './SearchForm';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

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
        {!isMobile && (
          <DesktopNav />
        )}

        {/* Desktop Search and User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <SearchForm 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            handleSearch={handleSearch} 
          />
          <UserMenu />
        </div>

        {/* Mobile Menu Button and User Menu */}
        <MobileNav 
          isOpen={isOpen} 
          toggleMenu={toggleMenu} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
    </nav>
  );
};

export default Navbar;
