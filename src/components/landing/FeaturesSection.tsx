
import React from 'react';

export const FeaturesSection = () => {
  return (
    <div className="py-12 px-4 bg-indigo-950/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="grid grid-cols-1">
          <div className="p-6 rounded-lg bg-sky-900/60 border border-sky-700/30 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-amber-300 mb-3">Movie Reviews & Ratings</h3>
            <p className="text-white/90">Get insightful movie reviews and ratings from trusted sources.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
