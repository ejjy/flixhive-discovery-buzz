
import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const MovieNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <p className="mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    </div>
  );
};

export default MovieNotFound;
