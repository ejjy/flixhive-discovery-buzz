
import React, { useState } from 'react';
import { Film, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    // Show loading toast
    toast({
      title: "Processing your request...",
      description: "Interpreting your movie description",
      duration: 2000,
    });

    // Process the natural language query
    // The searchService will handle the natural language processing
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
      <div className="flex flex-col justify-center">
        <div className="mb-8 flex items-center justify-center md:justify-start relative z-10">
          <Film className="h-12 w-12 text-amber-400 mr-2" />
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Flix<span className="text-amber-400">Hive</span>
          </h1>
        </div>
        
        <h2 className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl relative z-10 text-center md:text-left">
          Find out what to watch, with the best reviews and ratings
        </h2>

        <div className="mb-4 p-3 rounded-lg bg-indigo-900/30 border border-indigo-700/30 flex items-center">
          <Sparkles className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
          <p className="text-amber-100 text-sm">
            Try asking in natural language, like "a feel-good comedy for family night" or "something with aliens and time travel"
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative z-10 w-full max-w-xl mx-auto md:mx-0 space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="text-amber-400 w-6 h-6" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe what you feel like watching..."
              className="w-full pl-12 h-20 text-lg border-2 bg-indigo-950/40 border-amber-400/30 text-white placeholder:text-amber-100/70 focus:border-amber-400 focus:ring-amber-400/30 transition-colors"
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit"
              className="w-1/2 h-12 text-lg bg-amber-500 hover:bg-amber-600 text-white font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              Find my wish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
