
import React from 'react';
import { Film, Users } from 'lucide-react';

interface MovieOverviewProps {
  overview: string;
  director?: string;
  cast?: string[];
}

const MovieOverview: React.FC<MovieOverviewProps> = ({ overview, director, cast }) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Overview</h2>
        <p className="text-gray-300">{overview}</p>
      </div>
      
      {(director || (cast && cast.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {director && (
            <div>
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <Film className="w-4 h-4 mr-2 text-flixhive-accent" /> Director
              </h2>
              <p className="text-gray-300">{director}</p>
            </div>
          )}
          
          {cast && cast.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2 text-flixhive-accent" /> Cast
              </h2>
              <p className="text-gray-300">{cast.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MovieOverview;
