
import { Movie } from "@/types/movie";
import { SearchAnalysis } from "./types";

const moodToGenreMap: {[key: string]: string} = {
  'happy': 'Comedy',
  'sad': 'Drama',
  'funny': 'Comedy',
  'scary': 'Horror',
  'thrilling': 'Thriller',
  'exciting': 'Action',
  'romantic': 'Romance',
  'nostalgic': 'Drama',
  'dark': 'Thriller',
  'uplifting': 'Drama',
  'inspirational': 'Biography'
};

const themeToGenreMap: {[key: string]: string} = {
  'space': 'Science Fiction',
  'aliens': 'Science Fiction',
  'zombies': 'Horror',
  'robots': 'Science Fiction',
  'love': 'Romance',
  'family': 'Drama',
  'revenge': 'Thriller',
  'survival': 'Adventure',
  'murder': 'Crime',
  'conspiracy': 'Thriller',
  'magic': 'Fantasy',
  'dragons': 'Fantasy',
  'wizards': 'Fantasy',
  'ghosts': 'Horror',
  'haunted': 'Horror'
};

const moodAdjectives: {[key: string]: string} = {
  'happy': 'Joyful',
  'sad': 'Melancholic',
  'funny': 'Hilarious',
  'scary': 'Terrifying',
  'thrilling': 'Thrilling',
  'exciting': 'Exciting',
  'romantic': 'Passionate',
  'dark': 'Sinister',
  'light': 'Lighthearted',
  'uplifting': 'Inspiring',
  'intense': 'Intense'
};

export const generateMovie = (query: string, analysis: SearchAnalysis): Movie => {
  // Determine genres based on analysis
  let suggestedGenres = analysis.genres.length > 0 ? analysis.genres : [];
  
  if (suggestedGenres.length === 0 && analysis.moods.length > 0) {
    suggestedGenres = analysis.moods
      .map(mood => moodToGenreMap[mood])
      .filter(Boolean)
      .map(genre => genre[0].toUpperCase() + genre.slice(1));
  }
  
  if (suggestedGenres.length === 0 && analysis.themes.length > 0) {
    const themeGenres = analysis.themes
      .map(theme => themeToGenreMap[theme] || null)
      .filter(Boolean)
      .map(genre => genre[0].toUpperCase() + genre.slice(1));
      
    suggestedGenres = [...suggestedGenres, ...themeGenres];
  }
  
  if (suggestedGenres.length === 0) {
    suggestedGenres = ["Drama", "Adventure"];
  }
  
  // Generate title
  let generatedTitle = "";
  if (analysis.themes.length > 0) {
    generatedTitle = `The ${analysis.themes[0][0].toUpperCase() + analysis.themes[0].slice(1)}`;
  } else if (analysis.keyTerms.length > 0) {
    generatedTitle = analysis.keyTerms.map(term => term[0].toUpperCase() + term.slice(1)).join(' ');
  } else {
    generatedTitle = `${suggestedGenres[0]} Adventure`;
  }
  
  if (analysis.moods.length > 0) {
    const adjective = moodAdjectives[analysis.moods[0]];
    if (adjective) {
      generatedTitle = `The ${adjective} ${generatedTitle}`;
    }
  }
  
  // Generate overview
  let generatedOverview = `A ${analysis.moods.length > 0 ? analysis.moods[0] + " " : ""}movie about ${analysis.themes.length > 0 ? analysis.themes.join(' and ') : analysis.keyTerms.join(' and ')}. `;
  generatedOverview += `This ${suggestedGenres.join('/')} film takes viewers on ${analysis.eras.length > 0 ? `a journey to the ${analysis.eras[0]} ` : 'an unexpected journey '}`;
  generatedOverview += `through themes of ${['adventure', 'discovery', 'mystery', 'connection', 'conflict', 'redemption'].slice(0, 3).join(', ')}.`;
  generatedOverview += ` Based on your search for "${query}", this movie provides the perfect blend of ${suggestedGenres.join(' and ')} elements you're looking for.`;
  
  return {
    id: 1000 + Math.floor(Math.random() * 1000),
    title: generatedTitle,
    overview: generatedOverview,
    posterPath: "https://image.tmdb.org/t/p/w500/placeholder.svg",
    backdropPath: "https://image.tmdb.org/t/p/original/placeholder.svg",
    releaseDate: new Date().toISOString().split('T')[0],
    voteAverage: 7.0 + Math.random() * 2,
    genres: suggestedGenres.slice(0, 3),
    runtime: 90 + Math.floor(Math.random() * 60),
    director: "Acclaimed Director",
    cast: ["Leading Actor", "Supporting Actress", "Character Actor"],
    platforms: ["Netflix", "Prime Video"],
    platformRatings: [
      { platform: "IMDb", score: 7.0 + Math.random() * 2, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 70 + Math.floor(Math.random() * 25), outOf: 100 }
    ]
  };
};
