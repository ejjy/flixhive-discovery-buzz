
import React from 'react';
import Navbar from '@/components/navbar';
import { Film, Star, Users, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About FlixHive</h1>
          
          <div className="space-y-8">
            <section className="bg-flixhive-gray/20 p-6 rounded-lg border border-flixhive-gray/30">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Film className="text-flixhive-accent" />
                Our Mission
              </h2>
              <p className="text-gray-300 mb-4">
                FlixHive was created to revolutionize how people discover and engage with movies. 
                Using cutting-edge AI technology, we provide personalized movie recommendations, 
                insightful reviews, and a community platform for movie enthusiasts.
              </p>
              <p className="text-gray-300">
                Our goal is to help you find the perfect movie for any occasion, 
                tailored to your unique preferences and interests.
              </p>
            </section>
            
            <section className="bg-flixhive-gray/20 p-6 rounded-lg border border-flixhive-gray/30">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Star className="text-flixhive-accent" />
                Key Features
              </h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-flixhive-accent">•</span>
                  <span>AI-generated movie reviews summarizing critic and user opinions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flixhive-accent">•</span>
                  <span>Personalized recommendations based on your viewing history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flixhive-accent">•</span>
                  <span>Customizable watchlist to keep track of movies you want to see</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flixhive-accent">•</span>
                  <span>Compare ratings across different platforms like IMDb, Rotten Tomatoes, and Metacritic</span>
                </li>
              </ul>
            </section>
            
            <section className="bg-flixhive-gray/20 p-6 rounded-lg border border-flixhive-gray/30">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="text-flixhive-accent" />
                Our Team
              </h2>
              <p className="text-gray-300 mb-4">
                FlixHive was founded by a team of movie enthusiasts and tech innovators who wanted 
                to create a better way to discover and enjoy films. Our diverse team brings together 
                expertise in artificial intelligence, web development, and film theory.
              </p>
            </section>
            
            <section className="bg-flixhive-gray/20 p-6 rounded-lg border border-flixhive-gray/30">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Code className="text-flixhive-accent" />
                Technology
              </h2>
              <p className="text-gray-300">
                FlixHive is built using modern web technologies including React, TypeScript, and 
                Tailwind CSS. Our recommendation engine employs machine learning algorithms to 
                analyze user preferences and provide personalized suggestions. We continuously 
                improve our platform based on user feedback and emerging technologies.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
