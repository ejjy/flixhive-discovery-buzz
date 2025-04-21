
import { Movie } from "@/types/movie";
import { SearchAnalysis } from "./types";

export const scoreMovie = (movie: Movie, query: string, analysis: SearchAnalysis): number => {
  let score = 0;
  
  // Title match - higher weight
  if (movie.title.toLowerCase().includes(query.toLowerCase())) {
    score += 15;
  }
  
  // Genre matches
  analysis.genres.forEach(genre => {
    if (movie.genres.some(g => g.toLowerCase().includes(genre))) {
      score += 10;
    }
  });
  
  // Theme matches in overview
  analysis.themes.forEach(theme => {
    if (movie.overview.toLowerCase().includes(theme)) {
      score += 8;
    }
  });
  
  // Mood matches in overview
  analysis.moods.forEach(mood => {
    if (movie.overview.toLowerCase().includes(mood)) {
      score += 6;
    }
  });
  
  // Era matches
  analysis.eras.forEach(era => {
    if (movie.title.toLowerCase().includes(era)) {
      score += 7;
    }
    if (movie.overview.toLowerCase().includes(era)) {
      score += 5;
    }
    
    const yearMatch = era.match(/(\d{2})s/);
    if (yearMatch && movie.releaseDate) {
      const yearPrefix = yearMatch[1];
      const fullYear = parseInt(`19${yearPrefix}`) || parseInt(`20${yearPrefix}`);
      const releaseYear = new Date(movie.releaseDate).getFullYear();
      
      if (releaseYear >= fullYear && releaseYear < fullYear + 10) {
        score += 10;
      }
    }
  });
  
  // Key terms matching
  analysis.keyTerms.forEach(term => {
    if (movie.title.toLowerCase().includes(term)) {
      score += 8;
    }
    if (movie.overview.toLowerCase().includes(term)) {
      score += 5;
    }
  });
  
  // Implied intent matching
  if (analysis.impliedIntent && movie.overview.toLowerCase().includes(analysis.impliedIntent.toLowerCase())) {
    score += 12;
  }
  
  return score;
};
