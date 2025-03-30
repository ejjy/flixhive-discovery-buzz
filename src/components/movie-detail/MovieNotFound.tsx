
import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import { useNavigate } from 'react-router-dom';
import { Film, AlertTriangle } from 'lucide-react';

const MovieNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
        <p className="mb-6 text-lg max-w-lg mx-auto">
          The movie you're looking for doesn't exist or has been removed. This could also happen if there's an issue with the API connection.
        </p>
        <div className="space-y-4">
          <Button onClick={() => navigate('/')} size="lg" className="px-8">
            Go Home
          </Button>
          <div className="pt-8 text-sm text-gray-500 max-w-md mx-auto">
            <p>If you believe this is an error, please check that:</p>
            <ul className="mt-2 list-disc text-left pl-8">
              <li>Your API keys are correctly configured in Netlify environment variables</li>
              <li>The movie ID in the URL is correct</li>
              <li>Your internet connection is stable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieNotFound;
