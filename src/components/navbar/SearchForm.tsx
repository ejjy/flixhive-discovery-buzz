
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
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
  );
};

export default SearchForm;
